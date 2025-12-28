# Admin User Setup Guide

Follow these steps to create an admin user and access the admin dashboard.

## Step 1: Create User in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users** (in the left sidebar)
4. Click the **"Add User"** button (or **"Invite user"**)
5. Fill in the form:
   - **Email**: Your admin email address
   - **Password**: Create a strong password (or auto-generate)
   - Click **"Create user"** or **"Send invitation"**
6. **Important**: Copy the User ID (UUID) - you'll need it for the next step

## Step 2: Grant Admin Access

You need to add the user to the `admin_roles` table:

### Option A: Using SQL Editor (Recommended)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Paste this SQL (replace `YOUR_USER_ID_HERE` with the actual User ID):

```sql
INSERT INTO admin_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'Admin');
```

4. Click **"Run"** to execute

### Option B: Using Table Editor

1. In Supabase Dashboard, go to **Table Editor**
2. Select the **`admin_roles`** table
3. Click **"Insert row"**
4. Fill in:
   - **user_id**: Paste the User ID you copied
   - **role**: Type `Admin`
5. Click **"Save"**

## Step 3: Login to Admin Dashboard

1. Navigate to your website's admin login page: `http://your-domain.com/admin/login`
   - For local development: `http://localhost:5173/admin/login`
2. Enter your credentials:
   - **Email**: The email you created in Step 1
   - **Password**: The password you set
3. Click **"Sign In"**

You should now be redirected to the admin dashboard!

## Troubleshooting

### "You do not have admin access" error

This means the user exists but is not in the `admin_roles` table. Go back to Step 2 and add the user to the admin_roles table.

### "Invalid email or password" error

- Double-check your email and password
- Make sure the user was created successfully in Supabase
- Try resetting the password in Supabase Dashboard

### Can't find User ID

1. Go to **Authentication** → **Users** in Supabase
2. Find your user in the list
3. Click on the user
4. The User ID (UUID) is shown at the top

## Creating Additional Admin Users

To create more admin users, simply repeat all three steps above for each new admin account.

## Security Notes

- Keep admin credentials secure
- Use strong passwords
- Only grant admin access to trusted users
- The `admin_roles` table controls who can access the admin dashboard
