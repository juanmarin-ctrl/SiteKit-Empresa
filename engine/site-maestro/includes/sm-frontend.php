<?php
/**
 * Frontend runtime genérico. Lee meta del sitio (body_class) desde options o site.json del runtime.
 */
if (!defined('ABSPATH')) {
	exit;
}

if (defined('SM_FRONTEND_LOADED')) {
	return;
}
define('SM_FRONTEND_LOADED', true);

if (!defined('SM_RUNTIME_VERSION')) {
	define('SM_RUNTIME_VERSION', defined('SM_VERSION') ? SM_VERSION : '1.0.0');
}

function sm_runtime_base_path() {
	if (defined('SM_RUNTIME_PATH') && SM_RUNTIME_PATH) {
		return SM_RUNTIME_PATH;
	}
	if (defined('SM_PATH')) {
		return SM_PATH;
	}
	return '';
}

function sm_runtime_base_url() {
	if (defined('SM_RUNTIME_URL') && SM_RUNTIME_URL) {
		return SM_RUNTIME_URL;
	}
	if (defined('SM_URL')) {
		return SM_URL;
	}
	return '';
}

/**
 * site.json del runtime (o del payload si el instalador sigue activo).
 */
function sm_site_json() {
	static $data = null;
	if ($data !== null) {
		return $data;
	}
	$data = array();
	$candidates = array(
		sm_runtime_base_path() . 'assets/site.json',
		(defined('SM_PAYLOAD') ? SM_PAYLOAD : '') . 'site.json',
	);
	foreach ($candidates as $path) {
		if ($path && is_readable($path)) {
			$raw = (string) file_get_contents($path);
			if (substr($raw, 0, 3) === "\xEF\xBB\xBF") {
				$raw = substr($raw, 3);
			}
			$json = json_decode($raw, true);
			if (is_array($json)) {
				$data = $json;
				break;
			}
		}
	}
	return $data;
}

function sm_site_meta() {
	$meta = get_option('sm_site_meta');
	if (is_array($meta) && !empty($meta['body_class'])) {
		return $meta;
	}
	$data = sm_site_json();
	if (!empty($data['brand'])) {
		return array(
			'project_id' => $data['project_id'] ?? '',
			'body_class' => $data['brand']['body_class'] ?? 'site-maestro',
			'css_prefix' => $data['brand']['css_prefix'] ?? 's-site',
			'archetype' => $data['experience']['archetype'] ?? '',
		);
	}
	return array(
		'body_class' => 'site-maestro',
		'css_prefix' => 's-site',
	);
}

/**
 * Formulario de contacto genérico: los templates envían POST a admin-post.php con action=sm_contact.
 * Campos: name, email, msg, topic (opcional) y sm_hp (trampa anti-spam, debe ir vacío).
 */
function sm_handle_contact() {
	$back = wp_get_referer();
	if (!$back) {
		$back = home_url('/');
	}
	$back = remove_query_arg('sent', $back);
	$redirect = function ($ok) use ($back) {
		wp_safe_redirect(add_query_arg('sent', $ok ? '1' : '0', $back) . '#contact-form');
		exit;
	};

	if (!empty($_POST['sm_hp'])) { // phpcs:ignore WordPress.Security.NonceVerification
		$redirect(true);
	}
	$name = sanitize_text_field(wp_unslash($_POST['name'] ?? '')); // phpcs:ignore WordPress.Security.NonceVerification
	$email = sanitize_email(wp_unslash($_POST['email'] ?? '')); // phpcs:ignore WordPress.Security.NonceVerification
	$topic = sanitize_text_field(wp_unslash($_POST['topic'] ?? '')); // phpcs:ignore WordPress.Security.NonceVerification
	$msg = sanitize_textarea_field(wp_unslash($_POST['msg'] ?? '')); // phpcs:ignore WordPress.Security.NonceVerification
	if ($name === '' || !is_email($email)) {
		$redirect(false);
	}

	$data = sm_site_json();
	$to = !empty($data['contact']['email']) && is_email($data['contact']['email'])
		? $data['contact']['email']
		: get_option('admin_email');
	$subject = '[' . get_bloginfo('name') . '] ' . ($topic !== '' ? $topic . ' — ' : '') . $name;
	$body = "Name: $name\nEmail: $email\nTopic: $topic\n\n$msg\n";
	$ok = wp_mail($to, $subject, $body, array('Reply-To: ' . $name . ' <' . $email . '>'));
	$redirect($ok);
}
add_filter('teducas_language_post_map', function ($map) {
	$data = sm_site_json();
	return !empty($data['language_posts']) ? (array) $data['language_posts'] + (array) $map : $map;
});

/**
 * Páginas sin idioma propio (escritorio, carrito…): cabecera y pie del idioma del visitante.
 * El idioma lo decide Teducas Core; site.json indica cómo se distinguen las plantillas por título.
 */
add_filter('elementor/theme/get_location_templates/template_id', function ($template_id) {
	if (!class_exists('\\Teducas\\Core\\Modules\\Languages\\LanguageVersions')) {
		return $template_id;
	}
	$data = sm_site_json();
	$language = \Teducas\Core\Modules\Languages\LanguageVersions::current();
	if (empty($data['language_chrome'][$language])) {
		return $template_id;
	}
	$title = (string) get_the_title($template_id);
	foreach ($data['language_chrome'] as $marker) {
		if ($marker !== $data['language_chrome'][$language] && false !== strpos($title, $marker)) {
			$found = get_posts(array(
				'post_type' => 'elementor_library',
				'post_status' => 'publish',
				'numberposts' => 1,
				'fields' => 'ids',
				'title' => str_replace($marker, $data['language_chrome'][$language], $title),
			));
			return $found ? (int) $found[0] : $template_id;
		}
	}
	return $template_id;
});

add_action('admin_post_nopriv_sm_contact', 'sm_handle_contact');
add_action('admin_post_sm_contact', 'sm_handle_contact');

add_filter('body_class', function ($classes) {
	$meta = sm_site_meta();
	if (!empty($meta['body_class'])) {
		$classes[] = sanitize_html_class($meta['body_class']);
	}
	$classes[] = 'sm-site';
	if (!empty($meta['archetype'])) {
		$classes[] = 'sm-arch-' . sanitize_html_class($meta['archetype']);
	}
	return $classes;
});

add_action('wp_enqueue_scripts', function () {
	$base_path = sm_runtime_base_path();
	$base_url = sm_runtime_base_url();
	if (!$base_path || !$base_url) {
		return;
	}

	$css = '';
	$js = '';
	// Runtime layout
	if (is_readable($base_path . 'assets/branding.css')) {
		$css = $base_url . 'assets/branding.css';
	} elseif (defined('SM_PAYLOAD') && is_readable(SM_PAYLOAD . 'branding.css')) {
		$css = SM_URL . 'payload/branding.css';
	}
	if (is_readable($base_path . 'assets/frontend.js')) {
		$js = $base_url . 'assets/frontend.js';
	} elseif (defined('SM_PAYLOAD') && is_readable(SM_PAYLOAD . 'frontend.js')) {
		$js = SM_URL . 'payload/frontend.js';
	}

	$ver = SM_RUNTIME_VERSION;
	if ($css) {
		$css_file = (strpos($css, 'payload/') !== false && defined('SM_PAYLOAD'))
			? SM_PAYLOAD . 'branding.css'
			: $base_path . 'assets/branding.css';
		if (is_readable($css_file)) {
			$ver = (string) filemtime($css_file);
		}
		wp_enqueue_style('sm-branding', $css, array(), $ver);
	}
	if ($js) {
		wp_enqueue_script('sm-frontend', $js, array(), $ver, true);
	}
}, 20);
