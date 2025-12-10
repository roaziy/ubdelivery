import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createRestaurantAdmin() {
  console.log('🔧 Creating restaurant admin user...');

  const phone = '70117069';
  const password = 'Restaurant@123';
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, phone, name, role')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      console.log('ℹ️  User already exists, updating password...');
      
      // Update password and ensure role is correct
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          password_hash: passwordHash,
          role: 'restaurant_admin',
          is_active: true
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      console.log('✅ User updated successfully!');
      console.log('   Phone:', updatedUser.phone);
      console.log('   Name:', updatedUser.name);
      console.log('   Role:', updatedUser.role);
      console.log('   Password:', password);
      
      // Check if user owns a restaurant
      const { data: restaurant } = await supabaseAdmin
        .from('restaurants')
        .select('id, name')
        .eq('owner_id', updatedUser.id)
        .single();

      if (restaurant) {
        console.log('   Restaurant:', restaurant.name);
      } else {
        console.log('   ⚠️  No restaurant found for this user');
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          phone: phone,
          password_hash: passwordHash,
          name: 'Test Restaurant Admin',
          role: 'restaurant_admin',
          is_active: true
        })
        .select()
        .single();

      if (createError) throw createError;
      
      console.log('✅ User created successfully!');
      console.log('   Phone:', newUser.phone);
      console.log('   Name:', newUser.name);
      console.log('   Role:', newUser.role);
      console.log('   Password:', password);
      console.log('   ⚠️  No restaurant found. User can login but will need to create a restaurant.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) {
      console.error('   Details:', error.details);
    }
    process.exit(1);
  }
}

createRestaurantAdmin();

