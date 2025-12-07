//
// Decompiled by Jadx - 27

// By developer-krushna (https://github.com/developer-krushna/)

package turbotel.Utils;

import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.nativead.NativeAd;
import org.telegram.messenger.ApplicationLoader;

public abstract class a {
    public static String A = a.getString("admob_interstitial", "ca-app-pub-3940256099942544/1033173712");
    public static boolean A0 = a.getBoolean("keep_chat_open", true);
    public static boolean A1 = a.getBoolean("keep_opened_chats", false);
    public static boolean A2 = a.getBoolean("hq_voice", false);
    public static boolean B = a.getBoolean("ads_native_main", false);
    public static boolean B0 = a.getBoolean("keep_contacts", false);
    public static int B1 = a.getInt("contact_type", 0);
    public static int B2 = a.getInt("repeat_voice", 0);
    public static boolean C = a.getBoolean("ads_native_chat", false);
    public static boolean C0 = a.getBoolean("contact_changes", true);
    public static int C1 = a.getInt("map_provider", 3);
    public static int C2 = a.getInt("voice_changer_type", 0);
    public static boolean D = a.getBoolean("ads_native_profile", false);
    public static boolean D0 = a.getBoolean("hide_camera", false);
    public static boolean D1 = a.getBoolean("hide_blocked_user", false);
    public static int D2 = a.getInt("voice_speed", 1);
    public static int E = a.getInt("ads_full_proxies", 5);
    public static boolean E0 = a.getBoolean("start_main_camera", false);
    public static boolean E1 = a.getBoolean("decline_secret", false);
    public static int E2 = a.getInt("transpose_semitone", 5);
    public static int F = a.getInt("ads_full_changes", 5);
    public static boolean F0 = a.getBoolean("hide_anim_emoji_tabs", false);
    public static boolean F1 = a.getBoolean("mutual_del", false);
    public static boolean F2 = a.getBoolean("preview_sticker", true);
    public static int G = a.getInt("ads_full_profile", 10);
    public static boolean G0 = a.getBoolean("dont_hide_etab", false);
    public static boolean G1 = a.getBoolean("del_cache1", false);
    public static boolean G2 = a.getBoolean("preview_gif", true);
    public static int H = a.getInt("delay_app_open", 1);
    public static boolean H0 = a.getBoolean("dont_hide_stab", false);
    public static boolean H1 = a.getBoolean("acc_indicator", true);
    public static boolean H2 = a.getBoolean("confirm_audio", true);
    public static int I = a.getInt("delay_native_req", 5);
    public static boolean I0 = a.getBoolean("sync_fav_sticker", true);
    public static boolean I1 = a.getBoolean("sender_as_channel", true);
    public static boolean I2 = a.getBoolean("confirm_video", true);
    public static int J = a.getInt("delay_native_seen", 1);
    public static int J0 = a.getInt("sticker_size1", 14);
    public static boolean J1 = a.getBoolean("auto_translation", true);
    public static boolean J2 = a.getBoolean("confirm_forward", true);
    public static int K = a.getInt("delay_full", 17);
    public static boolean K0 = a.getBoolean("greeting_sticker", true);
    public static boolean K1 = a.getBoolean("editor_translator", false);
    public static boolean K2 = a.getBoolean("confirm_call", true);
    public static long L = a.getLong("open_last_watching", 0);
    public static boolean L0 = false;
    public static boolean L1 = a.getBoolean("always_expand", false);
    public static boolean L2 = a.getBoolean("confirm_gcall", true);
    public static long M = a.getLong("native_last_requesting", 0);
    public static String M0 = a.getString("answering_machine_msg", "User is not available right now, please leave a message.");
    public static boolean M1 = a.getBoolean("always_expand_bio", false);
    public static boolean M2 = a.getBoolean("confirm_join", false);
    public static long N = a.getLong("full_last_watching", 0);
    public static boolean N0 = a.getBoolean("cp_enable", true);
    public static boolean N1 = a.getBoolean("abuttons_profile", true);
    public static boolean N2 = a.getBoolean("boost_d_speed", false);
    public static long O = a.getLong("premium_last_login", 0);
    public static boolean O0 = a.getBoolean("cp_menu_inchat", true);
    public static boolean O1 = a.getBoolean("itabs_profile", false);
    public static boolean O2 = a.getBoolean("boost_u_speed", false);
    public static boolean P = a.getBoolean("title_center", false);
    public static boolean P0 = a.getBoolean("fm_notquot", false);
    public static boolean P1 = a.getBoolean("gif_autod_profile", true);
    public static boolean P2 = a.getBoolean("tag_editor", true);
    public static boolean Q = a.getBoolean("name_title", false);
    public static boolean Q0 = a.getBoolean("specific_contact", false);
    public static boolean Q1 = true;
    public static boolean Q2 = a.getBoolean("close_mini_apps", false);
    public static boolean R = a.getBoolean("turbo_face", true);
    public static int R0 = a.getInt("font_type", 3);
    public static boolean R1 = a.getBoolean("avatar_as_drawerbg", false);
    public static boolean R2 = a.getBoolean("invisible", false);
    public static boolean S = a.getBoolean("turbo_face_search", false);
    public static int S0 = a.getInt("editor_font_size", 18);
    public static boolean S1 = a.getBoolean("blur_drawerbg", false);
    public static boolean S2 = a.getBoolean("show_deleted", false);
    public static boolean T = a.getBoolean("turbo_face_title", true);
    public static boolean T0 = a.getBoolean("inapp_player", true);
    public static boolean T1 = a.getBoolean("darken_drawerbg", false);
    public static boolean T2 = a.getBoolean("show_edm", false);
    public static boolean U = a.getBoolean("ios_icons", true);
    public static boolean U0 = a.getBoolean("loop_all_videos", false);
    public static boolean U1 = a.getBoolean("hide_round_avatar", false);
    public static boolean U2 = a.getBoolean("show_dtm", false);
    public static boolean V = a.getBoolean("tface_big_icons", true);
    public static boolean V0 = a.getBoolean("auto_pause_video", false);
    public static boolean V1 = a.getBoolean("deface_phone_number", false);
    public static int V2 = a.getInt("avatar_tl", 28);
    public static boolean W = a.getBoolean("tface_ios_style", false);
    public static boolean W0 = a.getBoolean("merge_media", false);
    public static int W1 = a.getInt("snow_effect", 0);
    public static int W2 = a.getInt("avatar_tr", 28);
    public static boolean X = a.getBoolean("ios_chat", false);
    public static boolean X0 = a.getBoolean("swipe_reply", true);
    public static int X1 = a.getInt("drawer_icons", 0);
    public static int X2 = a.getInt("avatar_bl", 28);
    public static boolean Y = a.getBoolean("ios_editor", false);
    public static boolean Y0 = a.getBoolean("swipe_voice", true);
    public static boolean Y1 = a.getBoolean("search_in_submenu", true);
    public static int Y2 = a.getInt("avatar_br", 28);
    public static boolean Z = a.getBoolean("disable_stories", false);
    public static boolean Z0 = a.getBoolean("reply_vibration", true);
    public static boolean Z1 = a.getBoolean("player_only_downloaded", false);
    public static boolean Z2 = a.getBoolean("mini_alert", false);
    public static SharedPreferences a;
    public static int a0 = a.getInt("tablet_mod", 0);
    public static boolean a1 = a.getBoolean("swipe_forward", false);
    public static boolean a2 = a.getBoolean("sow_call_icon", false);
    public static String a3;
    public static String b = "ellipi.messenger";
    public static int b0 = a.getInt("turbo_anim", 0);
    public static boolean b1 = a.getBoolean("keep_selection", false);
    public static boolean b2 = a.getBoolean("contact_collapsed", false);
    public static String b3;
    public static String c = "https://github.com/NiREvil/vless";
    public static int c0 = a.getInt("action_snow_effect", 0);
    public static boolean c1 = a.getBoolean("gif_recent", true);
    public static boolean c2 = a.getBoolean("disable_proxy_vpn", false);
    public static String d = "https://play.google.com/store/apps/details?id=ellipi.messenger";
    public static boolean d0 = a.getBoolean("persian_date", false);
    public static int d1 = a.getInt("member_long_touch", 0);
    public static boolean d2 = a.getBoolean("hide_tabs", false);
    public static String e = "توربوتل";
    public static boolean e0 = a.getBoolean("enable24HourFormat", false);
    public static int e1 = a.getInt("nicewrite", 0);
    public static int e2 = a.getInt("tabs_style", 0);
    public static String f = "توربوتیل";
    public static int f0 = a.getInt("layout_direction", 0);
    public static int f1 = a.getInt("chat_bar_status", 3);
    public static boolean f2 = false;
    public static String g;
    public static boolean g0 = a.getBoolean("hide_phone", false);
    public static int g1 = a.getInt("contact_avatar_touch", 1);
    public static boolean g2 = a.getBoolean("move_tabs", true);
    public static String h;
    public static boolean h0 = a.getBoolean("avatar_in_action", true);
    public static int h1 = a.getInt("group_avatar_touch", 1);
    public static boolean h2 = a.getBoolean("inf_swipe", true);
    public static long i = 1041963357;
    public static boolean i0 = a.getBoolean("downloads_icon", true);
    public static int i1 = a.getInt("user_avatar_touch", 2);
    public static boolean i2 = a.getBoolean("tab_title", true);
    public static String j = "https://t.me/NiREvil_GP";
    public static boolean j0 = a.getBoolean("direct_forward_tabs", true);
    public static boolean j1 = a.getBoolean("swipe_to_archive", true);
    public static boolean j2 = a.getBoolean("swiping_tabs", true);
    public static boolean k = false;
    public static int k0 = a.getInt("photo_q", 80);
    public static boolean k1 = a.getBoolean("open_archive_onpull", false);
    public static boolean k2 = a.getBoolean("dis_counters", false);
    public static int l;
    public static boolean l0 = a.getBoolean("down_next_photo", true);
    public static boolean l1 = a.getBoolean("archived_in_tabs", false);
    public static boolean l2 = a.getBoolean("only_unmuted", false);
    public static int m;
    public static boolean m0 = a.getBoolean("cancel_download_on_closing", false);
    public static boolean m1 = a.getBoolean("hide_contacts_dialogs", false);
    public static String m2;
    public static String n;
    public static boolean n0 = a.getBoolean("back_basges", false);
    public static boolean n1 = a.getBoolean("double_to_Exit", true);
    public static String n2;
    public static String o = a.getString("remote_url", "https://raw.githubusercontent.com/NiREvil/vless/refs/heads/main/edge/assets/Manifest/TurboTel-Settings");
    public static boolean o0 = a.getBoolean("exact_count", false);
    public static String o1;
    public static boolean o2 = a.getBoolean("floating_btn", true);
    public static String p;
    public static boolean p0 = a.getBoolean("menu_context_blur", false);
    public static String p1;
    public static int p2 = a.getInt("floating_type", 0);
    public static boolean q = a.getBoolean("iranian", false);
    public static boolean q0 = a.getBoolean("reaction_menu", true);
    public static String q1;
    public static int q2 = a.getInt("floating_direction", 0);
    public static boolean r = a.getBoolean("malaysian", false);
    public static boolean r0 = a.getBoolean("reactions_on_bottom", false);
    public static boolean r1 = a.getBoolean("chat_unlocked", false);
    public static int r2 = a.getInt("toolbar_bsize", 50);
    public static boolean s = a.getBoolean("indonesian", false);
    public static boolean s0 = a.getBoolean("reaction_animation", true);
    public static boolean s1 = a.getBoolean("use_fingerprint", true);
    public static int s2 = a.getInt("toolbar_bspace", 13);
    public static boolean t = a.getBoolean("uzbek", false);
    public static boolean t0 = a.getBoolean("delete_animation", true);
    public static boolean t1 = a.getBoolean("show_hnotification", true);
    public static boolean t2 = a.getBoolean("chatbar", false);
    public static boolean u = a.getBoolean("verify_link_tip", false);
    public static int u0 = a.getInt("double_tap", 0);
    public static boolean u1 = a.getBoolean("account_unlocked", false);
    public static boolean u2 = a.getBoolean("bar_vertical", true);
    public static NativeAd v;
    public static boolean v0 = a.getBoolean("fast_edit", true);
    public static int v1 = a.getInt("turbo_bubble_style", 2);
    public static boolean v2 = a.getBoolean("bar_centerbtn", false);
    public static InterstitialAd w;
    public static boolean w0 = a.getBoolean("edit_pencil", true);
    public static String w1 = a.getString("turbo_check_style", "Stock");
    public static boolean w2 = a.getBoolean("cavatar_in_chat", false);
    public static String x = a.getString("admob_id", "ca-app-pub-3940256099942544~3347511713");
    public static boolean x0 = a.getBoolean("copy_sender", true);
    public static boolean x1 = a.getBoolean("hide_link_preview", false);
    public static boolean x2 = a.getBoolean("cavatar_in_group", true);
    public static String y = a.getString("admob_app_open", "ca-app-pub-3940256099942544/3419835294");
    public static boolean y0 = a.getBoolean("mutual_contact", true);
    public static boolean y1 = a.getBoolean("hide_sending_link_preview", false);
    public static boolean y2 = a.getBoolean("oavatar_in_chat", false);
    public static String z = a.getString("admob_native", "ca-app-pub-3940256099942544/2247696110");
    public static boolean z0 = a.getBoolean("chat_contact_status", true);
    public static boolean z1 = a.getBoolean("jump_to_channel", true);
    public static boolean z2 = a.getBoolean("oavatar_in_group", false);

    static {
        SharedPreferences sharedPreferences = ApplicationLoader.applicationContext.getSharedPreferences("turboconfig", 0);
        a = sharedPreferences;
        REvilCustomSettings();
        String str = "TurboTel";
        g = str;
        h = str;
        n = sharedPreferences.getString("remote_lnk", "null");
        String str2 = "";
        p = a.getString("url", str2);
        o1 = a.getString("turbo_lock_pass", str2);
        p1 = a.getString("turbo_lock_patt", str2);
        q1 = a.getString("app_lock_patt", str2);
        String str3 = "[0, 1, 2, 3, 4, 5, 6]";
        m2 = a.getString("tb_priority", str3);
        n2 = a.getString("stb_priority", str3);
        a3 = a.getString("mini_text", str2);
        b3 = a.getString("mini_link", str2);
    }

    public static void REvilCustomSettings() {
        SharedPreferences sharedPreferences = a;
        if (sharedPreferences.getInt("revil_setup_version", 0) < 3) {
            Editor edit = sharedPreferences.edit();
            edit.putBoolean("iranian", true);
            edit.putBoolean("keep_contacts", true);
            edit.putBoolean("disable_proxy_vpn", true);
            edit.putBoolean("sender_as_channel", true);
            edit.putBoolean("tab_title", true);
            edit.putBoolean("exact_count", true);
            edit.putBoolean("for_pro", true);
            edit.putBoolean("invisible", true);
            edit.putBoolean("preview_sticker", true);
            edit.putBoolean("always_expand", true);
            edit.putBoolean("enable24HourFormat", true);
            edit.putBoolean("cancel_download_on_closing", true);
            edit.putBoolean("name_title", true);
            edit.putBoolean("show_dtm", true);
            edit.putBoolean("confirm_video", true);
            edit.putBoolean("reaction_animation", true);
            edit.putBoolean("reaction_menu", true);
            edit.putBoolean("inf_swipe", true);
            edit.putBoolean("title_center", true);
            edit.putBoolean("menu_context_blur", true);
            edit.putBoolean("abuttons_profile", true);
            edit.putBoolean("swipe_reply", true);
            edit.putBoolean("avatar_in_action", true);
            edit.putBoolean("delete_animation", true);
            edit.putBoolean("move_tabs", true);
            edit.putBoolean("start_main_camera", true);
            edit.putBoolean("confirm_call", true);
            edit.putBoolean("confirm_gcall", true);
            edit.putBoolean("only_unmuted", true);
            edit.putBoolean("reply_vibration", true);
            edit.putBoolean("swipe_to_archive", true);
            edit.putBoolean("ios_chat", true);
            edit.putBoolean("always_expand_bio", true);
            edit.putBoolean("bookmark", true);
            edit.putBoolean("confirm_join", true);
            edit.putBoolean("chatbar", true);
            edit.putBoolean("cavatar_in_group", true);
            edit.putBoolean("mutual_contact", true);
            edit.putBoolean("inapp_player", true);
            edit.putBoolean("direct_forward_tabs", true);
            edit.putBoolean("preview_gif", true);
            edit.putBoolean("double_to_Exit", true);
            edit.putBoolean("keep_chat_open", true);
            edit.putBoolean("keep_selection", true);
            edit.putBoolean("confirm_audio", true);
            edit.putBoolean("jump_to_channel", true);
            edit.putBoolean("multi_for", true);
            edit.putBoolean("contact_changes", true);
            edit.putBoolean("auto_pause_video", true);
            edit.putBoolean("greeting_sticker", true);
            edit.putBoolean("hide_anim_emoji_tabs", true);
            edit.putBoolean("add_to_save", true);
            edit.putBoolean("swipe_voice", true);
            edit.putBoolean("persian_date", true);
            edit.putBoolean("sync_fav_sticker", true);
            edit.putBoolean("tag_editor", true);
            edit.putBoolean("keep_opened_chats", true);
            edit.putBoolean("turbo_face", false);
            edit.putBoolean("copy_sender", false);
            edit.putBoolean("chat_contact_status", false);
            edit.putBoolean("auto_translation", false);
            edit.putBoolean("bar_vertical", false);
            edit.putBoolean("add_to_dm", false);
            edit.putBoolean("mini_alert_show", false);
            edit.putBoolean("ads_native_main", false);
            edit.putBoolean("bar_centerbtn", false);
            edit.putBoolean("ads_native_profile", false);
            edit.putBoolean("hide_camera", false);
            edit.putBoolean("confirm_forward", false);
            edit.putBoolean("swipe_forward", false);
            edit.putBoolean("indonesian", false);
            edit.putBoolean("malaysian", false);
            edit.putBoolean("uzbek", false);
            edit.putBoolean("chat_unlocked", false);
            edit.putBoolean("oavatar_in_group", false);
            edit.putBoolean("editor_translator", false);
            edit.putBoolean("downloads_icon", false);
            edit.putBoolean("oavatar_in_chat", false);
            edit.putBoolean("ads_native_chat", false);
            edit.putBoolean("loop_all_videos", false);
            edit.putBoolean("suggested_tabs", false);
            edit.putBoolean("fast_edit", false);
            edit.putBoolean("edit_pencil", false);
            edit.putBoolean("copy_part", false);
            edit.putBoolean("gif_autod_profile", false);
            edit.putBoolean("cavatar_in_chat", false);
            edit.putBoolean("account_unlocked", false);
            edit.putInt("contact_type", 0);
            edit.putInt("ads_full_proxies", 0);
            edit.putInt("ads_full_profile", 0);
            edit.putInt("ads_full_changes", 0);
            edit.putInt("delay_native_req", 9999);
            edit.putInt("delay_full", 9999);
            edit.putInt("delay_app_open", 9999);
            edit.putInt("delay_native_seen", 9999);
            edit.putInt("member_avatar_touch", 2);
            edit.putInt("forward_type", 2);
            edit.putInt("member_long_touch", 1);
            edit.putInt("group_avatar_touch", 3);
            edit.putInt("editor_font_size", 15);
            edit.putInt("sticker_size1", 10);
            edit.putInt("contact_avatar_touch", 3);
            edit.putString("url", "");
            edit.putString("remote_lnk", "null");
            edit.putString("turbo_check_style", "MaxLinesPro");
            edit.putInt("revil_setup_version", 3);
            edit.commit();
        }
    }

    public static void a() {
        a.edit().clear().apply();
    }

    public static void b(String str, int i) {
        a.edit().putInt(str, i).commit();
        i();
    }

    public static void c(String str, long j) {
        a.edit().putLong(str, j).commit();
        i();
    }

    public static void d(String str, String str2) {
        a.edit().putString(str, str2).commit();
        i();
    }

    public static void e(String str, boolean z) {
        a.edit().putBoolean(str, z).commit();
        i();
    }

    public static boolean f(String str) {
        return a.contains(str);
    }

    public static SharedPreferences g() {
        return a;
    }

    public static void h(String str) {
        a.edit().remove(str).commit();
    }

    private static void i() {
        B1 = a.getInt("contact_type", 0);
        e1 = a.getInt("nicewrite", 0);
        f1 = a.getInt("chat_bar_status", 3);
        C2 = a.getInt("voice_changer_type", 0);
        D2 = a.getInt("voice_speed", 1);
        E2 = a.getInt("transpose_semitone", 5);
        O0 = a.getBoolean("cp_menu_inchat", true);
        P0 = a.getBoolean("fm_notquot", false);
        Q0 = a.getBoolean("specific_contact", false);
        R0 = a.getInt("font_type", 3);
        r1 = a.getBoolean("chat_unlocked", false);
        u1 = a.getBoolean("account_unlocked", false);
    }
}

// By developer-krushna (https://github.com/developer-krushna/)

