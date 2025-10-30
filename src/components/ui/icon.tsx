import React from 'react';
import { 
  Mail, MessageCircle, Phone, Facebook, Twitter, Youtube, Instagram, 
  Lightbulb, Globe, Heart, Users, FileText, Calendar, ArrowRight,
  LucideIcon 
} from 'lucide-react';

// Icon mapping for dynamic icon rendering
export const iconMap: Record<string, LucideIcon> = {
  Mail,
  MessageCircle,
  Phone,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Lightbulb,
  Globe,
  Heart,
  Users,
  FileText,
  Calendar,
  ArrowRight,
};

// Icon component that renders icons dynamically by name
export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "h-4 w-4" }) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }
  
  return <IconComponent className={className} />;
};