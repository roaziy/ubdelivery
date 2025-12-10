import supabaseAdmin from '../config/supabase.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create super admin user
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@ubdelivery.xyz';
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456';
    const passwordHash = await bcrypt.hash(superAdminPassword, 10);

    const { data: existingAdmin } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', superAdminEmail)
      .single();

    if (!existingAdmin) {
      const { data: superAdmin, error: adminError } = await supabaseAdmin
        .from('users')
        .insert({
          email: superAdminEmail,
          password_hash: passwordHash,
          name: 'Super Admin',
          role: 'super_admin',
          is_active: true
        })
        .select()
        .single();

      if (adminError) throw adminError;
      console.log('✅ Super admin created:', superAdmin.email);
    } else {
      console.log('ℹ️  Super admin already exists');
    }

    // Create sample restaurant with owner
    const { data: existingRestaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('name', 'Pizza Hut Mongolia')
      .single();

    if (!existingRestaurant) {
      // Create restaurant owner
      const ownerPasswordHash = await bcrypt.hash('Restaurant@123', 10);
      const { data: restaurantOwner, error: ownerError } = await supabaseAdmin
        .from('users')
        .insert({
          email: 'pizzahut@ubdelivery.xyz',
          phone: '99001122',
          password_hash: ownerPasswordHash,
          name: 'Pizza Hut Admin',
          role: 'restaurant_admin',
          is_active: true
        })
        .select()
        .single();

      if (ownerError) throw ownerError;

      // Create restaurant
      const { data: restaurant, error: restError } = await supabaseAdmin
        .from('restaurants')
        .insert({
          owner_id: restaurantOwner.id,
          name: 'Pizza Hut Mongolia',
          description: 'Дэлхийд алдартай пицца',
          cuisine_type: 'pizza',
          phone: '99001122',
          email: 'pizzahut@ubdelivery.xyz',
          address: 'Сүхбаатар дүүрэг, 1-р хороо',
          latitude: 47.9184,
          longitude: 106.9177,
          is_open: true,
          open_time: '10:00',
          close_time: '22:00',
          status: 'approved',
          setup_completed: true,
          rating: 4.5,
          total_reviews: 128
        })
        .select()
        .single();

      if (restError) throw restError;
      console.log('✅ Sample restaurant created:', restaurant.name);

      // Create food categories
      const categories = [
        { restaurant_id: restaurant.id, name: 'Пицца', sort_order: 1 },
        { restaurant_id: restaurant.id, name: 'Бургер', sort_order: 2 },
        { restaurant_id: restaurant.id, name: 'Ундаа', sort_order: 3 },
        { restaurant_id: restaurant.id, name: 'Хачапури', sort_order: 4 }
      ];

      const { data: insertedCategories, error: catError } = await supabaseAdmin
        .from('food_categories')
        .insert(categories)
        .select();

      if (catError) throw catError;
      console.log('✅ Food categories created:', insertedCategories.length);

      // Create sample foods
      const pizzaCategory = insertedCategories.find(c => c.name === 'Пицца');
      const burgerCategory = insertedCategories.find(c => c.name === 'Бургер');

      const foods = [
        {
          restaurant_id: restaurant.id,
          category_id: pizzaCategory.id,
          name: 'Pepperoni Pizza',
          description: 'Сонгодог пепперони пицца, моцарелла бяслагтай',
          price: 25000,
          is_available: true,
          preparation_time: 20
        },
        {
          restaurant_id: restaurant.id,
          category_id: pizzaCategory.id,
          name: 'Margherita Pizza',
          description: 'Улаан лооль, моцарелла, басилик',
          price: 22000,
          is_available: true,
          preparation_time: 18
        },
        {
          restaurant_id: restaurant.id,
          category_id: pizzaCategory.id,
          name: 'BBQ Chicken Pizza',
          description: 'BBQ сүүстэй тахианы мах, сонгино',
          price: 28000,
          is_available: true,
          preparation_time: 22
        },
        {
          restaurant_id: restaurant.id,
          category_id: burgerCategory.id,
          name: 'Classic Burger',
          description: 'Үхрийн махан котлет, салат, улаан лооль',
          price: 15000,
          is_available: true,
          preparation_time: 15
        },
        {
          restaurant_id: restaurant.id,
          category_id: burgerCategory.id,
          name: 'Cheese Burger',
          description: 'Давхар бяслагтай бургер',
          price: 18000,
          is_available: true,
          preparation_time: 15
        }
      ];

      const { error: foodError } = await supabaseAdmin
        .from('foods')
        .insert(foods);

      if (foodError) throw foodError;
      console.log('✅ Sample foods created:', foods.length);
    } else {
      console.log('ℹ️  Sample restaurant already exists');
    }

    // Create sample driver
    const { data: existingDriver } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', 'driver@ubdelivery.xyz')
      .single();

    if (!existingDriver) {
      const driverPasswordHash = await bcrypt.hash('Driver@123', 10);
      const { data: driverUser, error: driverUserError } = await supabaseAdmin
        .from('users')
        .insert({
          email: 'driver@ubdelivery.xyz',
          phone: '99112233',
          password_hash: driverPasswordHash,
          name: 'Батболд',
          role: 'driver',
          is_active: true
        })
        .select()
        .single();

      if (driverUserError) throw driverUserError;

      const { error: driverError } = await supabaseAdmin
        .from('drivers')
        .insert({
          user_id: driverUser.id,
          vehicle_type: 'Мотоцикл',
          vehicle_number: 'УБ-1234',
          license_number: 'AB123456',
          is_available: true,
          is_online: true,
          latitude: 47.9200,
          longitude: 106.9100,
          status: 'approved',
          rating: 4.8,
          total_deliveries: 156
        });

      if (driverError) throw driverError;
      console.log('✅ Sample driver created');
    } else {
      console.log('ℹ️  Sample driver already exists');
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Super Admin: admin@ubdelivery.xyz / Admin@123456');
    console.log('   Restaurant: pizzahut@ubdelivery.xyz / Restaurant@123');
    console.log('   Driver: driver@ubdelivery.xyz / Driver@123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
