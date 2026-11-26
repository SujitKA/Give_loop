-- ==============================================================================
-- GiveLoop - Database Seed Data (25 Realistic Sample Items)
-- ==============================================================================

DO $$
DECLARE
    user1_id UUID := '11111111-1111-1111-1111-111111111111';
    user2_id UUID := '22222222-2222-2222-2222-222222222222';
    user3_id UUID := '33333333-3333-3333-3333-333333333333';
    user4_id UUID := '44444444-4444-4444-4444-444444444444';
    item1_id UUID := 'a1111111-1111-1111-1111-111111111111';
    item2_id UUID := 'a2222222-2222-2222-2222-222222222222';
    item3_id UUID := 'a3333333-3333-3333-3333-333333333333';
BEGIN
    -- 1. Create 4 demo auth users if they don't already exist
    -- Password for all demo accounts: Password123!
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        user1_id,
        'authenticated',
        'authenticated',
        'aravind@giveloop.demo',
        crypt('Password123!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Aravind Sharma","city":"Bengaluru","phone":"+91 98765 43210"}',
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        user2_id,
        'authenticated',
        'authenticated',
        'priya@giveloop.demo',
        crypt('Password123!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Priya Nair","city":"Bengaluru","phone":"+91 98450 12345"}',
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        user3_id,
        'authenticated',
        'authenticated',
        'rohan@giveloop.demo',
        crypt('Password123!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Rohan Verma","city":"Mumbai","phone":"+91 91234 56789"}',
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        user4_id,
        'authenticated',
        'authenticated',
        'sneha@giveloop.demo',
        crypt('Password123!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"full_name":"Sneha Patel","city":"Delhi","phone":"+91 99887 76655"}',
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. Upsert Profiles for the demo users
    INSERT INTO public.profiles (id, full_name, city, avatar_url, phone)
    VALUES
    (
        user1_id,
        'Aravind Sharma',
        'Bengaluru',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
        '+91 98765 43210'
    ),
    (
        user2_id,
        'Priya Nair',
        'Bengaluru',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
        '+91 98450 12345'
    ),
    (
        user3_id,
        'Rohan Verma',
        'Mumbai',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
        '+91 91234 56789'
    ),
    (
        user4_id,
        'Sneha Patel',
        'Delhi',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
        '+91 99887 76655'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        city = EXCLUDED.city,
        avatar_url = EXCLUDED.avatar_url,
        phone = EXCLUDED.phone;

    -- 3. Clear existing seed items to avoid duplicates
    DELETE FROM public.items WHERE donor_id IN (user1_id, user2_id, user3_id, user4_id);

    -- 4. Insert 25 Realistic Sample Items
    INSERT INTO public.items (id, donor_id, title, description, category, condition, city, images, status, created_at)
    VALUES
    -- Item 1: Laptop
    (
        item1_id,
        user1_id,
        'Lenovo ThinkPad T480 (Core i5, 16GB RAM, 256GB SSD)',
        'Upgraded to a work laptop so giving this away. Fully functional ThinkPad with Linux Mint installed. Excellent battery life, charger included. Great for coding, web development, and college projects.',
        'Laptops',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '2 hours'
    ),
    -- Item 2: Textbook
    (
        item2_id,
        user2_id,
        'CLRS Introduction to Algorithms (4th Edition)',
        'Hardcover edition of Cormen, Leiserson, Rivest, and Stein. Finished my Algorithms coursework. No pencil markings inside, spine is intact like new. Ideal for 2nd or 3rd year CS students or GATE prep.',
        'Textbooks',
        'Like new',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '5 hours'
    ),
    -- Item 3: Furniture
    (
        item3_id,
        user1_id,
        'Ergonomic Mesh Study Chair with Adjustable Lumbar',
        'Giving away my ergonomic desk chair because I am relocating. Breathable mesh backrest, hydraulic height adjustment works smoothly, solid 5-wheel base. Clean and sanitized.',
        'Furniture',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1580481077195-c328a37db719?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '8 hours'
    ),
    -- Item 4: Clothes
    (
        gen_random_uuid(),
        user4_id,
        'Men''s Winter Puffer Down Jacket (Size L, Navy Blue)',
        'Very warm insulated puffer jacket, worn only during one trip to Himachal. Water-resistant outer shell with detachable hood. Freshly dry-cleaned.',
        'Clothes',
        'Like new',
        'Delhi',
        ARRAY[
            'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '12 hours'
    ),
    -- Item 5: Tech / Laptop
    (
        gen_random_uuid(),
        user3_id,
        'Acer 24-inch Full HD IPS Borderless Monitor',
        '75Hz refresh rate with HDMI and VGA ports. No dead pixels or scratches. Includes original power adapter and HDMI cable. Perfect dual monitor setup for students.',
        'Laptops',
        'Like new',
        'Mumbai',
        ARRAY[
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '1 day'
    ),
    -- Item 6: Textbook
    (
        gen_random_uuid(),
        user1_id,
        'Operating System Concepts (10th Dinosaur Edition)',
        'Silberschatz, Galvin, and Gagne. Complete textbook covering process synchronization, memory management, and file systems. Helpful for university exams and technical interviews.',
        'Textbooks',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '1 day 3 hours'
    ),
    -- Item 7: Furniture
    (
        gen_random_uuid(),
        user2_id,
        'Minimalist Wooden Study Desk (120cm x 60cm)',
        'Sturdy engineered wood study desk with black metal legs. Fits two monitors and a laptop easily. Minor cosmetic scuffs on one corner, otherwise rock solid.',
        'Furniture',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '1 day 6 hours'
    ),
    -- Item 8: Clothes
    (
        gen_random_uuid(),
        user3_id,
        'Classic Levi''s Denim Jacket (Unisex, Size M)',
        'Authentic blue denim jacket. Very durable, clean, washed and sanitized. No tears or stains. Free to anyone who will make good use of it.',
        'Clothes',
        'Good',
        'Mumbai',
        ARRAY[
            'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '2 days'
    ),
    -- Item 9: Tech
    (
        gen_random_uuid(),
        user4_id,
        'Dell Latitude 3490 (8GB RAM, 1TB HDD, Core i3 8th Gen)',
        'Old laptop used for online classes during lockdown. Battery needs to be plugged in, but works reliably for basic browsing, MS Office, and Python scripting. Original charger included.',
        'Laptops',
        'Fair',
        'Delhi',
        ARRAY[
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '2 days 4 hours'
    ),
    -- Item 10: Textbook
    (
        gen_random_uuid(),
        user2_id,
        'Computer Networking: A Top-Down Approach (Kurose & Ross)',
        'Standard 7th edition textbook for Computer Networks. Clean pages, highlighted main summaries. Great resource for socket programming and network protocols.',
        'Textbooks',
        'Like new',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '2 days 8 hours'
    ),
    -- Item 11: Other
    (
        gen_random_uuid(),
        user1_id,
        'Casio FX-991EX Classwiz Scientific Calculator',
        'Passed all my engineering exams! Non-programmable high-res LCD calculator allowed in university semester exams. Includes slide-on protective hard case.',
        'Other',
        'Like new',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '3 days'
    ),
    -- Item 12: Furniture
    (
        gen_random_uuid(),
        user3_id,
        'Foldable Bamboo Bed Lap Desk with Phone Slot',
        'Adjustable tilt table for working or reading in bed. Folds flat for compact storage under a bed or in a closet. Ideal for hostel rooms.',
        'Furniture',
        'Like new',
        'Mumbai',
        ARRAY[
            'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '3 days 6 hours'
    ),
    -- Item 13: Other
    (
        gen_random_uuid(),
        user4_id,
        'Samsonite 32L Padded College Laptop Backpack',
        'Durable water-resistant backpack with dedicated 15.6-inch padded laptop sleeve, organizer pockets, and side bottle holders. All zippers in smooth working order.',
        'Other',
        'Good',
        'Delhi',
        ARRAY[
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '4 days'
    ),
    -- Item 14: Clothes
    (
        gen_random_uuid(),
        user1_id,
        'Set of 3 College Cotton Hoodies (Size XL, Black/Grey/Maroon)',
        'Three fleece-lined pullover hoodies. Great for cool Bangalore evenings. Clean, washed, no tears.',
        'Clothes',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '4 days 5 hours'
    ),
    -- Item 15: Tech
    (
        gen_random_uuid(),
        user2_id,
        'Logitech MK270 Wireless Keyboard and Mouse Combo',
        'Full-size wireless keyboard with 8 shortcut keys and optical mouse. Includes 2.4GHz USB nano receiver. Battery life is fantastic.',
        'Laptops',
        'Like new',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '5 days'
    ),
    -- Item 16: Textbook
    (
        gen_random_uuid(),
        user3_id,
        'Database System Concepts (Silberschatz, Korth, Sudarshan)',
        'Comprehensive 6th edition covering relational algebra, SQL, indexing, and transaction management. Essential for DBMS laboratory and theory.',
        'Textbooks',
        'Good',
        'Mumbai',
        ARRAY[
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '5 days 8 hours'
    ),
    -- Item 17: Furniture
    (
        gen_random_uuid(),
        user1_id,
        'Compact 3-Tier Wooden Bookshelf / Storage Rack',
        'Freestanding bookcase in walnut finish. Easy to assemble and move. Can hold up to 40 books and stationery items.',
        'Furniture',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '6 days'
    ),
    -- Item 18: Other
    (
        gen_random_uuid(),
        user2_id,
        'Philips 1.5L Stainless Steel Electric Kettle',
        'Automatic cut-off, dry boil protection, 360-degree cordless pirouette base. Super useful for late-night hostel tea/noodles.',
        'Other',
        'Like new',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '6 days 12 hours'
    ),
    -- Item 19: Clothes
    (
        gen_random_uuid(),
        user4_id,
        'Raymond Formal Slim Fit Blazer (Size 40, Charcoal Grey)',
        'High quality formal single-breasted blazer. Worn twice for college placement interviews. Freshly dry-cleaned and bagged.',
        'Clothes',
        'Like new',
        'Delhi',
        ARRAY[
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '7 days'
    ),
    -- Item 20: Other
    (
        gen_random_uuid(),
        user3_id,
        'Kadence Acoustic Guitar with Padded Gig Bag',
        'Sunburst finish 38-inch acoustic guitar with spruce top. Includes spare strings and guitar picks. One small scrape on the back.',
        'Other',
        'Fair',
        'Mumbai',
        ARRAY[
            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '7 days 18 hours'
    ),
    -- Item 21: Textbook
    (
        gen_random_uuid(),
        user1_id,
        'Higher Engineering Mathematics by B.S. Grewal (44th Edition)',
        'Indispensable handbook for calculus, linear algebra, Laplace transforms, and complex variables for all engineering branches.',
        'Textbooks',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '8 days'
    ),
    -- Item 22: Tech
    (
        gen_random_uuid(),
        user4_id,
        'HP Pavilion 15 (Core i5 7th Gen, 8GB RAM, 1TB HDD)',
        'Older model but fully working. New battery installed last year. Windows 10 Home activated. Suitable for school work, presentations, and light browsing.',
        'Laptops',
        'Good',
        'Delhi',
        ARRAY[
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '8 days 12 hours'
    ),
    -- Item 23: Furniture
    (
        gen_random_uuid(),
        user2_id,
        'Adjustable Metal LED Desk Lamp with USB Charging Port',
        'Multi-angle gooseneck architect desk lamp with 3 color temperatures (warm, natural, cool white) and touch dimmer control.',
        'Furniture',
        'Like new',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80'
        ],
        'Available',
        now() - interval '9 days'
    ),
    -- Item 24: Reserved Item Example (for Demo / Viva Testing)
    (
        gen_random_uuid(),
        user1_id,
        'Apple MacBook Air 13-inch (2017 Model, 8GB RAM, 128GB)',
        'Given away to a junior student for introductory Swift and Web dev courses. Currently reserved for handover this weekend.',
        'Laptops',
        'Good',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
        ],
        'Reserved',
        now() - interval '10 days'
    ),
    -- Item 25: Given Item Example (for History / Demo)
    (
        gen_random_uuid(),
        user2_id,
        'GATE CS Previous 15 Years Chapterwise Solved Papers',
        'Completed GATE 2024 with rank 380! Successfully handed over to 3rd year student from RVCE.',
        'Textbooks',
        'Fair',
        'Bengaluru',
        ARRAY[
            'https://images.unsplash.com/photo-1532012164546-f432f2e3dd44?auto=format&fit=crop&w=800&q=80'
        ],
        'Given',
        now() - interval '12 days'
    );

    -- 5. Insert a sample pending request between demo users so the dashboard has live data
    INSERT INTO public.item_requests (item_id, requester_id, message, status, created_at)
    VALUES
    (
        item1_id,
        user2_id,
        'Hi Aravind! I am a 2nd year CS student at PES University and my current laptop died last week. I need this to complete our Operating Systems lab project. Could I please pick it up this Friday?',
        'Pending',
        now() - interval '1 hour'
    ),
    (
        item2_id,
        user3_id,
        'Hello Priya, I am preparing for competitive programming and would love to study from CLRS. I can collect it anytime in Indiranagar/Koramangala.',
        'Pending',
        now() - interval '3 hours'
    )
    ON CONFLICT (item_id, requester_id) DO NOTHING;

END $$;
