import {
  Globe,
  Newspaper,
  Radio,
  Headphones,
  PenTool,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Building2,
  TrendingUp,
} from "lucide-react";

export const getMediaIcon = (mediaType: string, outlet?: string) => {
  const iconProps = { className: "h-5 w-5" };

  // Social media specific icons
  if (outlet?.toLowerCase().includes("facebook")) {
    return <Facebook {...iconProps} className="h-5 w-5 text-blue-600" />;
  }
  if (
    outlet?.toLowerCase().includes("twitter") ||
    outlet?.toLowerCase().includes("x.com")
  ) {
    return <Twitter {...iconProps} className="h-5 w-5 text-blue-400" />;
  }
  if (outlet?.toLowerCase().includes("instagram")) {
    return <Instagram {...iconProps} className="h-5 w-5 text-pink-600" />;
  }
  if (outlet?.toLowerCase().includes("youtube")) {
    return <Youtube {...iconProps} className="h-5 w-5 text-red-600" />;
  }
  if (outlet?.toLowerCase().includes("linkedin")) {
    return <Linkedin {...iconProps} className="h-5 w-5 text-blue-700" />;
  }

  // Media type icons
  switch (mediaType) {
    case "Online News":
      return <Globe {...iconProps} className="h-5 w-5 text-blue-500" />;
    case "Print Media":
      return <Newspaper {...iconProps} className="h-5 w-5 text-gray-700" />;
    case "Broadcast":
      return <Radio {...iconProps} className="h-5 w-5 text-red-500" />;
    case "Podcast":
      return <Headphones {...iconProps} className="h-5 w-5 text-purple-500" />;
    case "Blog":
      return <PenTool {...iconProps} className="h-5 w-5 text-green-500" />;
    case "Social Media":
      return <TrendingUp {...iconProps} className="h-5 w-5 text-orange-500" />;
    default:
      return <Building2 {...iconProps} className="h-5 w-5 text-gray-500" />;
  }
};

export const getOutletIcon = (outlet: string) => {
  const iconProps = { className: "h-4 w-4" };

  switch (outlet.toLowerCase()) {
    case "techcrunch":
      return <Globe {...iconProps} className="h-4 w-4 text-green-600" />;
    case "forbes":
      return <TrendingUp {...iconProps} className="h-4 w-4 text-blue-600" />;
    case "reuters":
      return <Newspaper {...iconProps} className="h-4 w-4 text-orange-600" />;
    case "bloomberg":
      return <Building2 {...iconProps} className="h-4 w-4 text-black" />;
    case "wired":
      return <Globe {...iconProps} className="h-4 w-4 text-red-600" />;
    case "cnn business":
      return <Radio {...iconProps} className="h-4 w-4 text-red-500" />;
    default:
      return <Building2 {...iconProps} className="h-4 w-4 text-gray-500" />;
  }
};
