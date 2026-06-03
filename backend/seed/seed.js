import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Story from '../models/Story.js';
import Forum from '../models/Forum.js';
import Event from '../models/Event.js';
import Listing from '../models/Listing.js';
import Comment from '../models/Comment.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}), Post.deleteMany({}), Story.deleteMany({}),
      Forum.deleteMany({}), Event.deleteMany({}), Listing.deleteMany({}),
      Comment.deleteMany({}), Chat.deleteMany({}), Message.deleteMany({}),
      Notification.deleteMany({}), Review.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const users = await User.create([
      { name: 'Admin User', phone: '+919999999999', pincode: '110001', password: adminPassword, role: 'admin', city: 'New Delhi', state: 'Delhi', isPhoneVerified: true, neighborhood: 'Connaught Place', bio: 'Community admin' },
      { name: 'Priya Sharma', phone: '+919876543210', pincode: '110001', password: 'Test@1234', role: 'user', city: 'New Delhi', state: 'Delhi', isPhoneVerified: true, neighborhood: 'Connaught Place', bio: 'Love my neighborhood!' },
      { name: 'Rahul Verma', phone: '+919876543211', pincode: '110001', password: 'Test@1234', role: 'user', city: 'New Delhi', state: 'Delhi', isPhoneVerified: true, neighborhood: 'Janpath', bio: 'Software engineer & foodie' },
      { name: 'Ananya Patel', phone: '+919876543212', pincode: '560001', password: 'Test@1234', role: 'user', city: 'Bangalore', state: 'Karnataka', isPhoneVerified: true, neighborhood: 'MG Road', bio: 'Bengaluru local' },
      { name: 'Vikram Singh', phone: '+919876543213', pincode: '560001', password: 'Test@1234', role: 'user', city: 'Bangalore', state: 'Karnataka', isPhoneVerified: true, neighborhood: 'Indiranagar', bio: 'Entrepreneur' },
      { name: 'Neha Gupta', phone: '+919876543214', pincode: '400001', password: 'Test@1234', role: 'user', city: 'Mumbai', state: 'Maharashtra', isPhoneVerified: true, neighborhood: 'Colaba', bio: 'Mumbaikar at heart' },
      { name: 'Arjun Kumar', phone: '+919876543215', pincode: '400001', password: 'Test@1234', role: 'moderator', city: 'Mumbai', state: 'Maharashtra', isPhoneVerified: true, neighborhood: 'Fort', bio: 'Moderator for Mumbai' },
    ]);
    console.log(`Created ${users.length} users`);

    const posts = await Post.create([
      { content: 'Just moved into the neighborhood! Any recommendations for good local restaurants nearby? 🍕', author: users[1]._id, pincode: '110001', type: 'text' },
      { content: 'Beautiful sunrise at Lodhi Garden this morning!', author: users[2]._id, pincode: '110001', type: 'image', media: [{ url: 'https://res.cloudinary.com/demo/image/upload/sunrise.jpg', publicId: 'sunrise', type: 'image' }] },
      { content: '⚠️ ALERT: There is a power outage planned for Sector 12 tomorrow from 10am to 2pm. Please plan accordingly.', author: users[0]._id, pincode: '110001', type: 'alert', alertType: 'utility' },
      { content: 'Looking for a reliable plumber in Indiranagar. Any suggestions?', author: users[4]._id, pincode: '560001', type: 'text' },
      { content: 'Weekend flea market at Commercial Street! Great finds for home decor 🛍️', author: users[3]._id, pincode: '560001', type: 'image' },
      { content: 'Lost my keys near Colaba Causeway. If found please message me! 🙏', author: users[5]._id, pincode: '400001', type: 'text' },
      { content: '🚨 TRAFFIC ALERT: Marine Drive is heavily congested due to repairs. Use alternate routes.', author: users[6]._id, pincode: '400001', type: 'alert', alertType: 'traffic' },
      { content: 'What are your thoughts on the new waste segregation rules?', author: users[1]._id, pincode: '110001', type: 'text' },
    ]);
    console.log(`Created ${posts.length} posts`);

    await User.updateMany({}, { $inc: { postsCount: 1 } });

    const comment = await Comment.create({
      text: 'Welcome to the area! Try the Butter Chicken at Gulati\'s, you won\'t regret it!',
      author: users[0]._id,
      post: posts[0]._id,
    });
    await Comment.create({ text: 'Second that recommendation!', author: users[2]._id, post: posts[0]._id, parentComment: comment._id });
    await Comment.create({ text: 'Yes, there\'s Rajesh Plumber near 5th Cross. Let me know if you need his number.', author: users[3]._id, post: posts[3]._id });
    await Comment.create({ text: 'I\'ll keep an eye out! What color were they?', author: users[6]._id, post: posts[5]._id });
    console.log('Created comments');

    const now = new Date();
    await Story.create([
      { media: { url: 'https://res.cloudinary.com/demo/image/upload/story1.jpg', publicId: 'story1', type: 'image' }, author: users[1]._id, pincode: '110001', caption: 'Morning walk 🚶', expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
      { media: { url: 'https://res.cloudinary.com/demo/image/upload/story2.jpg', publicId: 'story2', type: 'image' }, author: users[3]._id, pincode: '560001', caption: 'Coffee time ☕', expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
    ]);
    console.log('Created stories');

    await Forum.create([
      { title: 'Tips for reducing neighborhood waste', content: 'Let\'s discuss ways we can collectively reduce waste in our area. I\'ve started composting and would love to hear what others are doing.', author: users[0]._id, pincode: '110001', category: 'general', tags: ['waste', 'environment', 'tips'] },
      { title: 'Need help with property tax filing', content: 'Can someone guide me through the process of filing property tax online? The website is quite confusing.', author: users[2]._id, pincode: '110001', category: 'help', tags: ['tax', 'property'] },
      { title: 'Best internet service provider in Indiranagar?', content: 'Moving to a new place and need to get internet connection. What do you all recommend?', author: users[4]._id, pincode: '560001', category: 'recommendations', tags: ['internet', 'utilities'] },
      { title: 'Neighborhood watch program', content: 'We should start a neighborhood watch program to improve safety. Who\'s interested?', author: users[6]._id, pincode: '400001', category: 'safety', tags: ['safety', 'community'] },
    ]);
    console.log('Created forums');

    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await Event.create([
      { title: 'Community Clean-Up Drive', description: 'Join us for a neighborhood clean-up! Gloves and bags will be provided.', author: users[0]._id, pincode: '110001', eventType: 'volunteering', location: { name: 'Lodhi Garden', lat: 28.5931, lng: 77.2195 }, startDate: nextWeek, endDate: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000), maxAttendees: 50 },
      { title: 'Diwali Festival Celebration', description: 'Celebrate Diwali together with music, food, and fireworks!', author: users[1]._id, pincode: '110001', eventType: 'festival', location: { name: 'Community Center, Connaught Place', lat: 28.6328, lng: 77.2197 }, startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), maxAttendees: 100 },
      { title: 'Yoga in the Park', description: 'Morning yoga session for all ages. Bring your own mat!', author: users[3]._id, pincode: '560001', eventType: 'workshop', location: { name: 'Cubbon Park', lat: 12.9763, lng: 77.5929 }, startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), maxAttendees: 30 },
    ]);
    console.log('Created events');

    await Listing.create([
      { title: 'Samsung Refrigerator - Like New', description: '3-door refrigerator, 6 months old, moving so selling. Works perfectly.', price: 25000, category: 'electronics', condition: 'like_new', seller: users[2]._id, pincode: '110001', expiresAt: nextMonth },
      { title: 'Wooden Study Table', description: 'Solid wood study table, 4ft x 2ft, excellent condition.', price: 4500, category: 'furniture', condition: 'good', seller: users[4]._id, pincode: '560001', expiresAt: nextMonth },
      { title: 'Mountain Bike for Sale', description: 'Hero Sprint mountain bike, 21 gears, ridden for 200km only.', price: 8000, category: 'vehicles', condition: 'good', seller: users[5]._id, pincode: '400001', expiresAt: nextMonth },
    ]);
    console.log('Created listings');

    await Review.create([
      { rating: 5, text: 'Great neighbor! Very helpful and friendly.', reviewer: users[1]._id, targetUser: users[0]._id },
      { rating: 4, text: 'Reliable and prompt with communication.', reviewer: users[0]._id, targetUser: users[2]._id },
    ]);
    console.log('Created reviews');

    const chat = await Chat.create({ participants: [users[0]._id, users[1]._id] });
    await Message.create([
      { chat: chat._id, sender: users[0]._id, content: 'Welcome to Neighborify! How can I help you?' },
      { chat: chat._id, sender: users[1]._id, content: 'Hi! I was wondering about the community clean-up event details.' },
    ]);
    chat.lastMessage = { content: 'Hi! I was wondering about the community clean-up event details.', sender: users[1]._id, sentAt: new Date() };
    await chat.save();
    console.log('Created chat');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📱 Test Accounts:');
    console.log('   Admin:  +919999999999 / ' + adminPassword);
    console.log('   User 1: +919876543210 / Test@1234 (Delhi)');
    console.log('   User 2: +919876543211 / Test@1234 (Delhi)');
    console.log('   User 3: +919876543212 / Test@1234 (Bangalore)');
    console.log('   User 4: +919876543213 / Test@1234 (Bangalore)');
    console.log('   User 5: +919876543214 / Test@1234 (Mumbai)');
    console.log('   User 6: +919876543215 / Test@1234 (Mumbai, Moderator)');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
