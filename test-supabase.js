require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Supabase Bağlantı Testi\n');

// Environment variables kontrolü
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment Variables:');
console.log('✓ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Ayarlanmış' : '❌ Bulunamadı');
console.log('✓ NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Ayarlanmış' : '❌ Bulunamadı');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Hata: .env.local dosyasında gerekli değişkenler bulunamadı!');
  console.log('\nLütfen .env.local dosyasını şu formatta oluşturun:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
  process.exit(1);
}

console.log('\n📡 Supabase bağlantısı test ediliyor...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// Basit bir sorgu ile bağlantıyı test et
async function testConnection() {
  try {
    // Auth durumunu kontrol et
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Auth kontrol edilirken bir uyarı:', authError.message);
    } else {
      console.log('✅ Auth bağlantısı başarılı');
      console.log('   Session:', session ? 'Aktif oturum var' : 'Oturum yok (normal)');
    }

    // Tablolardan birini kontrol et (profiles tablosu varsa)
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.log('\n⚠️  Database tabloları henüz oluşturulmamış!');
        console.log('   👉 Lütfen supabase/schema.sql dosyasını Supabase SQL Editor\'da çalıştırın');
      } else {
        console.log('\n⚠️  Database hatası:', error.message);
        console.log('   Code:', error.code);
      }
    } else {
      console.log('✅ Database bağlantısı başarılı');
      console.log('   Profiles tablosu erişilebilir');
    }

    // Genel bağlantı özeti
    console.log('\n📊 Bağlantı Özeti:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey.substring(0, 20) + '...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!error || error.code === '42P01') {
      console.log('\n✅ Supabase bağlantısı BAŞARILI!');
      if (error && error.code === '42P01') {
        console.log('⚠️  Ancak database şeması henüz yüklenmemiş');
      }
    } else {
      console.log('\n❌ Bağlantı başarısız oldu');
    }

  } catch (err) {
    console.log('\n❌ Beklenmeyen hata:', err.message);
    console.log('\nMuhtemel sebepler:');
    console.log('- URL veya Key yanlış');
    console.log('- Supabase projesi erişilebilir değil');
    console.log('- İnternet bağlantısı sorunu');
  }
}

testConnection();
