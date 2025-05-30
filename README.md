# Sosyal Medya  Platformu

Bu proje, kullanıcıların postlar ve anketler oluşturabileceği, paylaşabileceği ve kaydedebileceği bir sosyal medya platformudur. Kullanıcılar, diğer kullanıcıların içeriklerini görüntüleyebilir, anketlere oy verebilir ve beğendikleri içerikleri kaydederek daha sonra erişebilir.

## Özellikler
- **Login olma ve Register oluşturma**:Kullanıcılar öncellikle sisteme kayıt yaptırmalıdır ardından kayıt bilgileriyle login olabilirler.
- **Post Oluşturma ve Paylaşma**: Kullanıcılar metin, etiket ve görsel içeren postlar oluşturabilir.
- **Takip Sistemi**: Kullanıcılar başka kullanıcıları takip edebilir ve paylaşımlarını görebilir.
- **Anket Sistemi**: Kullanıcılar çoktan seçmeli anketler oluşturabilir ve diğer kullanıcılar bu anketlere oy verebilir.
- **Kaydetme (Bookmark)**: Kullanıcılar hem postları hem anketleri kaydedip daha sonra görüntüleyebilir.
- **Arama**: Kaydedilen içeriklerde metin bazlı arama yapma imkanı.
- **Bildirimler**:İçeriklerin oluşturulması ya da etkileşim gerçekleşmesi sonuucnda kullanıcılara özgü bildirim gönderilmektedir.
- **Kullanıcı Profilleri**: Kullanıcıların isim, e-posta ve profil resmi ile özelleştirilmiş profilleri.
- **Etkileşimler**: Postlar ve anketler için beğenme, yorum yapma ve paylaşma (gelecekte eklenecek).
- **Mobil Uyumluluk**: Responsive tasarım ile mobil cihazlarda sorunsuz kullanım.

## Teknolojiler

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, MongoDB, Mongoose
- **Kimlik Doğrulama**: JWT (JSON Web Tokens)
- **API**: Next.js API Routes
- **Diğer**: timeago.js (zaman formatlama), react-icons, react-toastify (bildirimler)

## Kurulum

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

- Node.js (v16 veya üstü)
- MongoDB (yerel veya bulut tabanlı, örneğin MongoDB Atlas)
- npm veya yarn

### Adımlar

1. **Depoyu Klonlayın**:
   ```bash
   git clone https://github.com/hakan4773/NextJS-SocialMedia-App.git
   cd NextJS-SocialMedia-App
