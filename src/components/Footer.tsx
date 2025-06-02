
import React from 'react';
import { Facebook, Youtube, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/50 border-t border-white/10 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/48bd98a0-c7ee-4b45-adf1-cca6b79289b4.png" 
                alt="Fakibaz Logo"
                className="w-8 h-8"
              />
              <h3 className="text-xl font-bold text-white">Fakibaz</h3>
            </div>
            <p className="text-gray-300 text-sm">
              শিক্ষার জগতে এক নতুন বিপ্লব। সকল ক্লাসের নোট, প্রশ্নপত্র এবং শিক্ষামূলক সামগ্রী একসাথে।
            </p>
            
            {/* App Download */}
            <div className="space-y-2">
              <p className="text-gray-300 text-sm font-medium">অ্যাপ ডাউনলোড করুন</p>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 w-fit cursor-pointer hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span className="text-white text-sm">Google Play</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">লিংক</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">আমাদের সম্পর্কে</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">ক্যারিয়ার</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">ক্লাস</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">টিউটর পোর্টাল</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">যোগাযোগ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">16780</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">team@fakibaz.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  Rangs Paramount, Level 11 Block-K, Plot-11 Rd No 17, Dhaka 1213
                </span>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">কোম্পানির তথ্য</h4>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                <span className="font-medium">Trade licence No:</span><br />
                TRAD/DNCC/037245/2022
              </p>
              <p className="text-gray-300 text-sm">
                <span className="font-medium">E-TIN Number:</span><br />
                197682866359
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <p className="text-gray-300 text-sm">আমাদের সাথে কানেক্ট থাকো</p>
              <div className="flex items-center space-x-4 mt-2">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              2025 Fakibaz Technologies Bangladesh Ltd
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
