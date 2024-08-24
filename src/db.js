
import mongoose from 'mongoose';

const mongoURI = 'mongodb://127.0.0.1:27017/Tech-Connect';
;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');      
  } catch (error) {
    console.error('Error connecting to MongoDB:', error); 
    process.exit(1);
  }
};

export default connectDB;



