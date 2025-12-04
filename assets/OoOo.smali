.class public LbotX/OoOo;
.super Ljava/lang/Object;
.source "OoOo.java"


# static fields
.field private static alert:Landroid/app/AlertDialog;

.field private static but:Landroid/widget/TextView;

.field private static but1:Landroid/widget/TextView;

.field private static button:Landroid/widget/LinearLayout;

.field private static dialog:Landroid/widget/LinearLayout;

.field private static message:Landroid/widget/TextView;

.field private static showTime:I

.field private static title:Landroid/widget/TextView;


# direct methods
.method static constructor <clinit>()V
    .registers 1

    .prologue
    .line 31
    const v0, 0x1

    sput v0, LbotX/OoOo;->showTime:I

    return-void
.end method

.method public constructor <init>()V
    .registers 1

    .prologue
    .line 22
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static synthetic access$0()Landroid/app/AlertDialog;
    .registers 1

    .prologue
    .line 24
    sget-object v0, LbotX/OoOo;->alert:Landroid/app/AlertDialog;

    return-object v0
.end method

.method public static decrypt(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .registers 6

    .prologue
    .line 45
    const-string v1, ""

    .line 47
    :try_start_2
    invoke-static {p1}, LbotX/OoOo;->generateKey(Ljava/lang/String;)Ljavax/crypto/SecretKey;

    move-result-object v0

    check-cast v0, Ljavax/crypto/spec/SecretKeySpec;

    .line 48
    const-string v2, "AES"

    invoke-static {v2}, Ljavax/crypto/Cipher;->getInstance(Ljava/lang/String;)Ljavax/crypto/Cipher;

    move-result-object v2

    .line 49
    const/4 v3, 0x2

    invoke-virtual {v2, v3, v0}, Ljavax/crypto/Cipher;->init(ILjava/security/Key;)V

    .line 50
    const/4 v0, 0x0

    invoke-static {p0, v0}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    move-result-object v0

    .line 51
    invoke-virtual {v2, v0}, Ljavax/crypto/Cipher;->doFinal([B)[B

    move-result-object v2

    .line 52
    new-instance v0, Ljava/lang/String;

    invoke-direct {v0, v2}, Ljava/lang/String;-><init>([B)V
    :try_end_20
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_20} :catch_21

    .line 55
    :goto_20
    return-object v0

    :catch_21
    move-exception v0

    move-object v0, v1

    goto :goto_20
.end method

.method private static designLayouts()V
    .registers 5

    .prologue
    const/16 v2, 0x32

    const/4 v4, 0x0

    .line 93
    sget-object v0, LbotX/OoOo;->button:Landroid/widget/LinearLayout;

    invoke-static {}, LbotX/OoOo;->param()Landroid/widget/LinearLayout$LayoutParams;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 94
    sget-object v0, LbotX/OoOo;->button:Landroid/widget/LinearLayout;

    const/16 v1, 0xa

    invoke-virtual {v0, v4, v1, v4, v4}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    .line 96
    sget-object v0, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v2, v2, v2, v2}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    .line 97
    sget-object v0, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setElevation(F)V

    .line 98
    sget-object v0, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V

    .line 99
    sget-object v0, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    new-instance v1, LbotX/OoOo$1;

    invoke-direct {v1}, LbotX/OoOo$1;-><init>()V

    const v2, 0x1e

    const-string v3, "#FFF1F1F1"

    invoke-virtual {v1, v2, v3}, LbotX/OoOo$1;->getIns(ILjava/lang/String;)Landroid/graphics/drawable/GradientDrawable;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setBackgroundDrawable(Landroid/graphics/drawable/Drawable;)V

    .line 100
    sget-object v0, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    invoke-static {}, LbotX/OoOo;->param()Landroid/widget/LinearLayout$LayoutParams;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 101
    sget-object v0, LbotX/OoOo;->alert:Landroid/app/AlertDialog;

    invoke-virtual {v0}, Landroid/app/AlertDialog;->getWindow()Landroid/view/Window;

    move-result-object v0

    new-instance v1, Landroid/graphics/drawable/InsetDrawable;

    new-instance v2, Landroid/graphics/drawable/ColorDrawable;

    invoke-direct {v2, v4}, Landroid/graphics/drawable/ColorDrawable;-><init>(I)V

    const/16 v3, 0x14

    invoke-direct {v1, v2, v3}, Landroid/graphics/drawable/InsetDrawable;-><init>(Landroid/graphics/drawable/Drawable;I)V

    invoke-virtual {v0, v1}, Landroid/view/Window;->setBackgroundDrawable(Landroid/graphics/drawable/Drawable;)V

    .line 102
    return-void
.end method

.method private static designTexts()V
    .registers 7

    .prologue
    const/16 v6, 0x14

    const/16 v5, 0xa

    const/high16 v4, 0x41700000  # 15.0f

    const/4 v3, 0x5

    const/4 v2, 0x0

    .line 67
    sget-object v0, LbotX/OoOo;->title:Landroid/widget/TextView;

    const/16 v1, 0x32

    invoke-virtual {v0, v3, v5, v2, v1}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 68
    sget-object v0, LbotX/OoOo;->title:Landroid/widget/TextView;

    const v1, 0x5

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setGravity(I)V

    .line 69
    sget-object v0, LbotX/OoOo;->title:Landroid/widget/TextView;

    const/high16 v1, 0x41900000  # 18.0f

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextSize(F)V

    .line 70
    sget-object v0, LbotX/OoOo;->title:Landroid/widget/TextView;

    const-string v1, "#FF212121"

    invoke-static {v1}, Landroid/graphics/Color;->parseColor(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextColor(I)V

    .line 71
    sget-object v0, LbotX/OoOo;->title:Landroid/widget/TextView;

    invoke-static {}, LbotX/OoOo;->param()Landroid/widget/LinearLayout$LayoutParams;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 74
    sget-object v0, LbotX/OoOo;->message:Landroid/widget/TextView;

    invoke-static {}, LbotX/OoOo;->param()Landroid/widget/LinearLayout$LayoutParams;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 75
    sget-object v0, LbotX/OoOo;->message:Landroid/widget/TextView;

    const v1, 0x11

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setGravity(I)V

    .line 76
    sget-object v0, LbotX/OoOo;->message:Landroid/widget/TextView;

    const/16 v1, 0x32

    invoke-virtual {v0, v3, v5, v2, v1}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 77
    sget-object v0, LbotX/OoOo;->message:Landroid/widget/TextView;

    const/high16 v1, 0x41800000  # 16.0f

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextSize(F)V

    .line 78
    sget-object v0, LbotX/OoOo;->message:Landroid/widget/TextView;

    const-string v1, "#FF757575"

    invoke-static {v1}, Landroid/graphics/Color;->parseColor(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextColor(I)V

    .line 81
    sget-object v0, LbotX/OoOo;->but:Landroid/widget/TextView;

    invoke-virtual {v0, v4}, Landroid/widget/TextView;->setTextSize(F)V

    .line 82
    sget-object v0, LbotX/OoOo;->but:Landroid/widget/TextView;

    const/16 v1, 0x1e

    invoke-virtual {v0, v6, v2, v1, v2}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 83
    sget-object v0, LbotX/OoOo;->but:Landroid/widget/TextView;

    invoke-static {}, LbotX/OoOo;->param()Landroid/widget/LinearLayout$LayoutParams;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 84
    sget-object v0, LbotX/OoOo;->but:Landroid/widget/TextView;

    const v3, 0x3

    invoke-virtual {v0, v3}, Landroid/widget/TextView;->setGravity(I)V

    .line 85
    sget-object v0, LbotX/OoOo;->but:Landroid/widget/TextView;

    const-string v1, "#FF616161"

    invoke-static {v1}, Landroid/graphics/Color;->parseColor(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextColor(I)V

    .line 88
    sget-object v0, LbotX/OoOo;->but1:Landroid/widget/TextView;

    invoke-virtual {v0, v4}, Landroid/widget/TextView;->setTextSize(F)V

    .line 89
    sget-object v0, LbotX/OoOo;->but1:Landroid/widget/TextView;

    const/16 v1, 0x1e

    invoke-virtual {v0, v6, v2, v1, v2}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 90
    sget-object v0, LbotX/OoOo;->but1:Landroid/widget/TextView;

    const-string v1, "#FF616161"

    invoke-static {v1}, Landroid/graphics/Color;->parseColor(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextColor(I)V

    .line 91
    return-void
.end method

.method private static generateKey(Ljava/lang/String;)Ljavax/crypto/SecretKey;
    .registers 5
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .prologue
    .line 35
    const-string v0, "SHA-256"

    invoke-static {v0}, Ljava/security/MessageDigest;->getInstance(Ljava/lang/String;)Ljava/security/MessageDigest;

    move-result-object v0

    .line 36
    const-string v1, "UTF-8"

    invoke-virtual {p0, v1}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B

    move-result-object v1

    .line 37
    const/4 v2, 0x0

    array-length v3, v1

    invoke-virtual {v0, v1, v2, v3}, Ljava/security/MessageDigest;->update([BII)V

    .line 38
    invoke-virtual {v0}, Ljava/security/MessageDigest;->digest()[B

    move-result-object v0

    .line 39
    new-instance v1, Ljavax/crypto/spec/SecretKeySpec;

    const-string v2, "AES"

    invoke-direct {v1, v0, v2}, Ljavax/crypto/spec/SecretKeySpec;-><init>([BLjava/lang/String;)V

    .line 40
    return-object v1
.end method

.method public static get(Landroid/content/Context;)V
    .registers 10

    .prologue
    const/4 v8, 0x1

    const/4 v7, 0x0

    .line 106
    const-string v0, ""

    invoke-virtual {p0, v0, v7}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    const-string v1, "tPuMiwVQg"

    invoke-interface {v0, v1, v7}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v0

    sget v1, LbotX/OoOo;->showTime:I

    if-eq v0, v1, :cond_11a

    .line 108
    const-string v0, ""

    invoke-virtual {p0, v0, v7}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    const-string v1, "tPuMiwVQg"

    const-string v2, ""

    invoke-virtual {p0, v2, v7}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v2

    const-string v3, "tPuMiwVQg"

    invoke-interface {v2, v3, v7}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v2

    add-int/lit8 v2, v2, 0x1

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->commit()Z

    .line 111
    new-instance v0, Landroid/app/AlertDialog$Builder;

    invoke-direct {v0, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    invoke-virtual {v0}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object v0

    sput-object v0, LbotX/OoOo;->alert:Landroid/app/AlertDialog;

    .line 112
    new-instance v0, Landroid/widget/LinearLayout;

    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    sput-object v0, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    .line 113
    new-instance v0, Landroid/widget/TextView;

    invoke-direct {v0, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    sput-object v0, LbotX/OoOo;->title:Landroid/widget/TextView;

    .line 114
    new-instance v0, Landroid/widget/TextView;

    invoke-direct {v0, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    sput-object v0, LbotX/OoOo;->message:Landroid/widget/TextView;

    .line 115
    new-instance v0, Landroid/widget/LinearLayout;

    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    sput-object v0, LbotX/OoOo;->button:Landroid/widget/LinearLayout;

    .line 116
    new-instance v0, Landroid/widget/TextView;

    invoke-direct {v0, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    sput-object v0, LbotX/OoOo;->but:Landroid/widget/TextView;

    .line 117
    new-instance v0, Landroid/widget/TextView;

    invoke-direct {v0, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    sput-object v0, LbotX/OoOo;->but1:Landroid/widget/TextView;

    .line 120
    const-string v0, "uCXr1E2UpORs4c4gEMLz7A=="

    const-string v1, " "

    invoke-static {v0, v1}, LbotX/OoOo;->decrypt(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 121
    const-string v1, "jI5L4Ltkc17AZhHKF3TRKcHJRddr3CLsbyvgmQSqooIUrbCcriFUNvS5M08gNLvRgrL7cSLq6cDrTdvXnddYw/9TQ9oUBlwVhU55SFUKGIU="

    const-string v2, "زندگی با سرپیچی و عصیان، آغاز می\u200cشود"

    invoke-static {v1, v2}, LbotX/OoOo;->decrypt(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 122
    const-string v2, "✕"

    .line 123
    const-string v3, "△"

    .line 127
    :try_start_7c
    sget-object v4, LbotX/OoOo;->title:Landroid/widget/TextView;

    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v5

    const-string v6, "ruznameh.ttf"

    invoke-static {v5, v6}, Landroid/graphics/Typeface;->createFromAsset(Landroid/content/res/AssetManager;Ljava/lang/String;)Landroid/graphics/Typeface;

    move-result-object v5

    const/4 v6, 0x1

    invoke-virtual {v4, v5, v6}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    .line 128
    sget-object v4, LbotX/OoOo;->message:Landroid/widget/TextView;

    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v5

    const-string v6, "ruznameh.ttf"

    invoke-static {v5, v6}, Landroid/graphics/Typeface;->createFromAsset(Landroid/content/res/AssetManager;Ljava/lang/String;)Landroid/graphics/Typeface;

    move-result-object v5

    const/4 v6, 0x0

    invoke-virtual {v4, v5, v6}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    .line 129
    sget-object v4, LbotX/OoOo;->but:Landroid/widget/TextView;

    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v5

    const-string v6, "Inter-Regular.ttf"

    invoke-static {v5, v6}, Landroid/graphics/Typeface;->createFromAsset(Landroid/content/res/AssetManager;Ljava/lang/String;)Landroid/graphics/Typeface;

    move-result-object v5

    const/4 v6, 0x0

    invoke-virtual {v4, v5, v6}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    .line 130
    sget-object v4, LbotX/OoOo;->but1:Landroid/widget/TextView;

    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v5

    const-string v6, "Inter-Regular.ttf"

    invoke-static {v5, v6}, Landroid/graphics/Typeface;->createFromAsset(Landroid/content/res/AssetManager;Ljava/lang/String;)Landroid/graphics/Typeface;

    move-result-object v5

    const/4 v6, 0x0

    invoke-virtual {v4, v5, v6}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V
    :try_end_bc
    .catch Ljava/lang/Exception; {:try_start_7c .. :try_end_bc} :catch_11b

    .line 139
    :goto_bc
    invoke-static {}, LbotX/OoOo;->designLayouts()V

    .line 140
    invoke-static {}, LbotX/OoOo;->designTexts()V

    .line 143
    sget-object v4, LbotX/OoOo;->button:Landroid/widget/LinearLayout;

    sget-object v5, LbotX/OoOo;->but:Landroid/widget/TextView;

    invoke-virtual {v4, v5, v7}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;I)V

    .line 144
    sget-object v4, LbotX/OoOo;->button:Landroid/widget/LinearLayout;

    sget-object v5, LbotX/OoOo;->but1:Landroid/widget/TextView;

    invoke-virtual {v4, v5, v8}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;I)V

    .line 147
    sget-object v4, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    sget-object v5, LbotX/OoOo;->title:Landroid/widget/TextView;

    invoke-virtual {v4, v5, v7}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;I)V

    .line 148
    sget-object v4, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    sget-object v5, LbotX/OoOo;->message:Landroid/widget/TextView;

    invoke-virtual {v4, v5, v8}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;I)V

    .line 149
    sget-object v4, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    sget-object v5, LbotX/OoOo;->button:Landroid/widget/LinearLayout;

    const/4 v6, 0x2

    invoke-virtual {v4, v5, v6}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;I)V

    .line 152
    sget-object v4, LbotX/OoOo;->alert:Landroid/app/AlertDialog;

    sget-object v5, LbotX/OoOo;->dialog:Landroid/widget/LinearLayout;

    invoke-virtual {v4, v5}, Landroid/app/AlertDialog;->setView(Landroid/view/View;)V

    .line 155
    sget-object v4, LbotX/OoOo;->but1:Landroid/widget/TextView;

    new-instance v5, LbotX/OoOo$2;

    invoke-direct {v5, p0}, LbotX/OoOo$2;-><init>(Landroid/content/Context;)V

    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 162
    sget-object v4, LbotX/OoOo;->but:Landroid/widget/TextView;

    new-instance v5, LbotX/OoOo$3;

    invoke-direct {v5}, LbotX/OoOo$3;-><init>()V

    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 170
    sget-object v4, LbotX/OoOo;->title:Landroid/widget/TextView;

    invoke-virtual {v4, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 171
    sget-object v0, LbotX/OoOo;->message:Landroid/widget/TextView;

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 172
    sget-object v0, LbotX/OoOo;->but:Landroid/widget/TextView;

    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 173
    sget-object v0, LbotX/OoOo;->but1:Landroid/widget/TextView;

    invoke-virtual {v0, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 175
    sget-object v0, LbotX/OoOo;->alert:Landroid/app/AlertDialog;

    invoke-virtual {v0}, Landroid/app/AlertDialog;->show()V

    .line 179
    :cond_11a
    return-void

    .line 133
    :catch_11b
    move-exception v4

    sget-object v4, LbotX/OoOo;->title:Landroid/widget/TextView;

    sget-object v5, Landroid/graphics/Typeface;->SANS_SERIF:Landroid/graphics/Typeface;

    invoke-virtual {v4, v5, v8}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    .line 134
    sget-object v4, LbotX/OoOo;->message:Landroid/widget/TextView;

    sget-object v5, Landroid/graphics/Typeface;->SANS_SERIF:Landroid/graphics/Typeface;

    invoke-virtual {v4, v5, v7}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    .line 135
    sget-object v4, LbotX/OoOo;->but:Landroid/widget/TextView;

    sget-object v5, Landroid/graphics/Typeface;->SANS_SERIF:Landroid/graphics/Typeface;

    invoke-virtual {v4, v5, v7}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    .line 136
    sget-object v4, LbotX/OoOo;->but1:Landroid/widget/TextView;

    sget-object v5, Landroid/graphics/Typeface;->SANS_SERIF:Landroid/graphics/Typeface;

    invoke-virtual {v4, v5, v7}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    goto/16 :goto_bc
.end method

.method private static param()Landroid/widget/LinearLayout$LayoutParams;
    .registers 3

    .prologue
    .line 60
    new-instance v0, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v1, -0x1

    const/4 v2, -0x2

    invoke-direct {v0, v1, v2}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    .line 61
    const/high16 v1, 0x3f800000  # 1.0f

    iput v1, v0, Landroid/widget/LinearLayout$LayoutParams;->weight:F

    .line 62
    return-object v0
.end method
