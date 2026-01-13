-- Seed Mock Data for Reviews and Maps

DO $$
DECLARE
  uluwatu_id uuid;
  komodo_id uuid;
  borobudur_id uuid;
BEGIN
  -- Get IDs (assuming names match the previous seed)
  SELECT id INTO uluwatu_id FROM destinations WHERE name = 'Uluwatu Temple' LIMIT 1;
  SELECT id INTO komodo_id FROM destinations WHERE name = 'Komodo National Park' LIMIT 1;
  SELECT id INTO borobudur_id FROM destinations WHERE name = 'Borobudur Temple' LIMIT 1;

  -- 1. Uluwatu Temple
  IF uluwatu_id IS NOT NULL THEN
    -- Update Map URL
    UPDATE destinations 
    SET map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.865570077995!2d115.08424077435903!3d-8.829177291223963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24ffc29cb322b%3A0xab7d58df1272!2sUluwatu%20Temple!5e0!3m2!1sen!2sid!4v1710234567890!5m2!1sen!2sid'
    WHERE id = uluwatu_id;

    -- Insert Reviews
    INSERT INTO reviews (destination_id, author_name, rating, text, relative_time_description, profile_photo_url)
    VALUES 
    (uluwatu_id, 'Sarah Jenkins', 5, 'Absolutely breathtaking views! The sunset was magical, though it does get quite crowded. Highly recommend getting there early.', '2 weeks ago', 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random'),
    (uluwatu_id, 'Michael Chen', 4, 'Great experience. The ticketing system was organized, and the facilities were clean. A must-visit.', '1 month ago', 'https://ui-avatars.com/api/?name=Michael+Chen&background=random'),
    (uluwatu_id, 'Elena Rodriguez', 5, 'One of the highlights of our trip to Indonesia. The cultural performance at night was spectacular.', '2 months ago', 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random');
  END IF;

  -- 2. Komodo National Park
  IF komodo_id IS NOT NULL THEN
    UPDATE destinations 
    SET map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252438.3571667085!2d119.34966367676675!3d-8.582857448554833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2db4686411516641%3A0xc63806c27806556!2sKomodo%20National%20Park!5e0!3m2!1sen!2sid!4v1710234567891!5m2!1sen!2sid'
    WHERE id = komodo_id;

    INSERT INTO reviews (destination_id, author_name, rating, text, relative_time_description, profile_photo_url)
    VALUES 
    (komodo_id, 'James Wilson', 5, 'Seeing the dragons in person was unreal. Our guide was meaningful and safe. The pink beach is also stunning.', '3 days ago', 'https://ui-avatars.com/api/?name=James+Wilson&background=random'),
    (komodo_id, 'Anita Pratiwi', 5, 'Diving here is world-class. Saw mantas, turtles, and sharks. Very well preserved nature.', '1 week ago', 'https://ui-avatars.com/api/?name=Anita+Pratiwi&background=random');
  END IF;

  -- 3. Borobudur Temple
  IF borobudur_id IS NOT NULL THEN
    UPDATE destinations 
    SET map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.21666497262!2d110.2011883743438!3d-7.607873792407519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a8cf009a7d697%3A0xdd4f1f2687179574!2sBorobudur%20Temple!5e0!3m2!1sen!2sid!4v1710234567892!5m2!1sen!2sid'
    WHERE id = borobudur_id;

    INSERT INTO reviews (destination_id, author_name, rating, text, relative_time_description, profile_photo_url)
    VALUES 
    (borobudur_id, 'David Kim', 5, 'The sunrise tour is expensive but totally worth it. The mist clearing up over the stupas is magical.', '3 weeks ago', 'https://ui-avatars.com/api/?name=David+Kim&background=random'),
    (borobudur_id, 'Sophie Martin', 4, 'Very hot during the day, bring an umbrella! The architecture is mind-blowing though.', '2 months ago', 'https://ui-avatars.com/api/?name=Sophie+Martin&background=random');
  END IF;

END $$;
