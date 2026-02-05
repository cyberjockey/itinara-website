# Supabase Email Templates for Itinara Web App

Copy these HTML templates into your Supabase Dashboard under **Authentication > Email Templates**.

## 1. Confirm Signup
**Subject:** Welcome to Itinara! Please confirm your email

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
        .header { background: #ffffff; padding: 32px 40px; text-align: center; border-bottom: 1px solid #f3f4f6; }
        .logo { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; text-decoration: none; display: inline-block; }
        .logo span { color: #2563eb; }
        .content { padding: 48px 40px; background: #ffffff; text-align: center; }
        .icon-container { width: 64px; height: 64px; background-color: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #2563eb; font-size: 28px; }
        .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em; }
        .p { margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6; }
        .button-container { margin: 36px 0; }
        .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        .button:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3); }
        .footer { padding: 32px 40px; background-color: #f8fafc; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        .footer a { color: #64748b; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="{{ .SiteURL }}" class="logo">Itinara<span>.</span></a>
        </div>
        <div class="content">
            <div class="icon-container">👋</div>
            <h1 class="h1">Welcome to Itinara!</h1>
            <p class="p">Thanks for signing up regardless if you're a traveler or a guide. We're excited to have you on board.</p>
            <p class="p">Please verify your email address to unlock your account and start your journey.</p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
            </div>
            
            <p class="p" style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                If you didn't create an account, you can safely ignore this email.
            </p>
        </div>
        <div class="footer">
            <p>&copy; Itinara. All rights reserved.</p>
            <p>123 Travel Street, Adventure City</p>
        </div>
    </div>
</body>
</html>
```

## 2. Invite User
**Subject:** You've been invited to join Itinara

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
        .header { background: #ffffff; padding: 32px 40px; text-align: center; border-bottom: 1px solid #f3f4f6; }
        .logo { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; text-decoration: none; display: inline-block; }
        .logo span { color: #2563eb; }
        .content { padding: 48px 40px; background: #ffffff; text-align: center; }
        .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em; }
        .p { margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6; }
        .button-container { margin: 36px 0; }
        .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        .button:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3); }
        .footer { padding: 32px 40px; background-color: #f8fafc; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="{{ .SiteURL }}" class="logo">Itinara<span>.</span></a>
        </div>
        <div class="content">
            <h1 class="h1">You've been invited! 🎉</h1>
            <p class="p">You have been invited to join Itinara.</p>
            <p class="p">Click the button below to accept your invitation and create your account.</p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Accept Invitation</a>
            </div>
            
            <p class="p" style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                If you didn't expect this invitation, you can safely ignore this email.
            </p>
        </div>
        <div class="footer">
            <p>&copy; Itinara. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## 3. Magic Link
**Subject:** Log in to Itinara

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
        .header { background: #ffffff; padding: 32px 40px; text-align: center; border-bottom: 1px solid #f3f4f6; }
        .logo { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; text-decoration: none; display: inline-block; }
        .logo span { color: #2563eb; }
        .content { padding: 48px 40px; background: #ffffff; text-align: center; }
        .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em; }
        .p { margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6; }
        .button-container { margin: 36px 0; }
        .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        .button:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3); }
        .footer { padding: 32px 40px; background-color: #f8fafc; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="{{ .SiteURL }}" class="logo">Itinara<span>.</span></a>
        </div>
        <div class="content">
            <h1 class="h1">Your Login Link</h1>
            <p class="p">Click the button below to log in to your account.</p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Log In Now</a>
            </div>
            
            <p class="p" style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                This link will expire soon. If you didn't request this, you can safely ignore this email.
            </p>
        </div>
        <div class="footer">
            <p>&copy; Itinara. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## 4. Reset Password
**Subject:** Reset your Itinara password

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
        .header { background: #ffffff; padding: 32px 40px; text-align: center; border-bottom: 1px solid #f3f4f6; }
        .logo { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; text-decoration: none; display: inline-block; }
        .logo span { color: #2563eb; }
        .content { padding: 48px 40px; background: #ffffff; text-align: center; }
        .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em; }
        .p { margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6; }
        .button-container { margin: 36px 0; }
        .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        .button:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3); }
        .footer { padding: 32px 40px; background-color: #f8fafc; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="{{ .SiteURL }}" class="logo">Itinara<span>.</span></a>
        </div>
        <div class="content">
            <h1 class="h1">Reset Password</h1>
            <p class="p">We received a request to reset your password. Click the button below to choose a new one.</p>
            
            <div class="button-container">
                <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            </div>
            
            <p class="p" style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                If you didn't request a password reset, you can safely ignore this email.
            </p>
        </div>
        <div class="footer">
            <p>&copy; Itinara. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```
