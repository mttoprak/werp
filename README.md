# Werp

Bu proje, sunucu ve kanal tabanlı bir sohbet uygulamasıdır. Kullanıcılar sunucu oluşturabilir, kanallarda mesajlaşabilir ve arkadaşlık istekleri gönderebilir.

## Özellikler
- Sunucu ve kanal oluşturma
- Kanalda mesajlaşma (gerçek zamanlı)
- Arkadaşlık isteği gönderme
- JWT tabanlı kimlik doğrulama
- Sunucuya davet kodu ile katılma

## Kurulum

### Gereksinimler
- Node.js (v18+ önerilir)
- MongoDB (local veya cloud)

### Adımlar
1. Depoyu klonlayın:
   ```bash
   git clone <repo-url>
   ```
2. Sunucu ve istemci dizinlerine bağımlılıkları yükleyin:
   ```bash
   cd deneme-project/server
   npm install
   cd ../client
   npm install
   ```
3. Sunucu için `.env` dosyasını oluşturun ve MongoDB bağlantı adresinizi girin:
   ```env
   MONGO_URI=mongodb://localhost:27017/werp
   PORT=5000
   JWT_SECRET=[rastgele bir değer1] 
   JWT_EXPIRATION=1h
   JWT_REFRESH_SECRET= [rastgele bir değer2]
   JWT_REFRESH_EXPIRATION=7d
   ```
4. İstemci için `.env` dosyasını oluşturun:
   ```env
   server=http://localhost:5000
   ```

## Çalıştırma

### Sunucu
```bash
cd server
npm start
```

### İstemci
```bash
cd client
npm run dev
```

## Kullanım
- Kayıt olun ve giriş yapın.
- Sunucu oluşturun, kanal ekleyin.
- Kanallarda mesajlaşın.
- Arkadaş ekleyin ve davet kodu ile sunucuya katılın.

## Katkı
Pull request ve issue açabilirsiniz.

## Lisans
MIT

