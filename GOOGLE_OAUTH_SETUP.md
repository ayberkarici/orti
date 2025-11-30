# Google OAuth Kurulum Rehberi (Production İçin)

Bu rehber, Google Cloud Console üzerinden kendi OAuth kimlik bilgilerinizi oluşturup Supabase projenize nasıl bağlayacağınızı anlatır.

## 1. Google Cloud Console'da Proje Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin.
2. Sol üstteki proje seçiciye tıklayın ve **"New Project"** (Yeni Proje) butonuna basın.
3. Projenize bir isim verin (örn: `Orti Calendar`) ve **Create**'e basın.
4. Projenin oluşturulmasını bekleyin ve oluşturulduğunda o projeyi seçin.

## 2. OAuth Consent Screen (İzin Ekranı) Ayarları

1. Sol menüden **"APIs & Services"** > **"OAuth consent screen"** seçeneğine gidin.
2. User Type olarak **"External"** (Harici) seçin ve **Create**'e basın.
3. **App Information** kısmını doldurun:
   - **App name:** Orti (veya uygulamanızın adı)
   - **User support email:** Kendi email adresiniz
   - **Developer contact information:** Kendi email adresiniz
4. **Save and Continue** butonuna basın.
5. **Scopes** sayfasında "Add or Remove Scopes" diyerek `userinfo.email`, `userinfo.profile` ve `openid` seçeneklerini işaretleyin. (Genelde varsayılan olarak seçilidir).
6. **Test Users** kısmını şimdilik boş geçebilirsiniz (Production'a geçtiğinizde "Publish App" diyerek uygulamayı yayınlamanız gerekecek).

## 3. Credentials (Kimlik Bilgileri) Oluşturma

1. Sol menüden **"Credentials"** seçeneğine gidin.
2. Üstteki **"+ CREATE CREDENTIALS"** butonuna tıklayın ve **"OAuth client ID"** seçeneğini seçin.
3. **Application type** olarak **"Web application"** seçin.
4. **Name** kısmına bir isim verin (örn: `Orti Web Client`).
5. **Authorized redirect URIs** (Yetkili yönlendirme URI'leri) kısmına gelince durun. Buraya Supabase'den alacağımız URL'i yapıştıracağız.

## 4. Supabase'den Redirect URL Alma

1. [Supabase Dashboard](https://supabase.com/dashboard)'unuza gidin.
2. Projenizi seçin.
3. Sol menüden **Authentication** > **Providers** kısmına gidin.
4. **Google** seçeneğine tıklayın (henüz enable etmediyseniz kapalı görünebilir, tıklayıp açın).
5. En üstte **"Callback URL (for OAuth)"** yazan yeri bulun ve o URL'i kopyalayın.
   - Şuna benzer bir şey olacaktır: `https://[project-ref].supabase.co/auth/v1/callback`

## 5. Google Cloud ve Supabase'i Bağlama

1. **Google Cloud Console'a geri dönün.**
2. Kopyaladığınız URL'i **"Authorized redirect URIs"** kısmına **ADD URI** diyerek yapıştırın.
3. **CREATE** butonuna basın.
4. Karşınıza **Client ID** ve **Client Secret** bilgilerini içeren bir pencere çıkacak.

## 6. Bilgileri Supabase'e Girme

1. **Client ID**'yi kopyalayın -> Supabase'de **"Client ID"** kutusuna yapıştırın.
2. **Client Secret**'ı kopyalayın -> Supabase'de **"Client Secret"** kutusuna yapıştırın.
3. Supabase'de **Save** (Kaydet) butonuna basın.

## 7. Son Kontrol

Artık uygulamanızda "Google ile Giriş Yap" butonuna bastığınızda, Google'ın izin ekranı çıkacak ve uygulamanızın adı (Orti) görünecektir.

---

### ⚠️ Önemli Notlar

- **Testing vs Production:** Google Cloud'da OAuth Consent Screen "Testing" modundayken sadece "Test Users" listesine eklediğiniz emailler giriş yapabilir. Herkesin giriş yapabilmesi için OAuth Consent Screen sayfasında **"PUBLISH APP"** butonuna basarak uygulamayı "Production" moduna almanız gerekir.
- **Doğrulama:** Uygulamanız sadece temel profil bilgilerini (email, isim, avatar) istediği için Google'ın detaylı doğrulama sürecine (verification) girmesine gerek yoktur. Ancak logo vb. eklerseniz doğrulama isteyebilir.
