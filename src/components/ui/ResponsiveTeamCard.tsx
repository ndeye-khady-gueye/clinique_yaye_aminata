import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Linkedin, Twitter, Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialLink {
  platform: 'email' | 'phone' | 'linkedin' | 'twitter' | 'github' | 'website';
  url: string;
  label?: string;
}

interface ResponsiveTeamCardProps {
  name: string;
  role: string;
  department?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: SocialLink[];
  skills?: string[];
  experience?: string;
  location?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
  className?: string;
}

const ResponsiveTeamCard: React.FC<ResponsiveTeamCardProps> = ({
  name,
  role,
  department,
  bio,
  avatar,
  socialLinks = [],
  skills = [],
  experience,
  location,
  actions = [],
  className = ""
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'website':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn('card-responsive hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg sm:text-xl font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          {/* Informations principales */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {role}
            </p>
            {department && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                {department}
              </p>
            )}
            {bio && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {bio}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {/* Informations supplémentaires */}
          {(experience || location) && (
            <div className="space-y-2">
              {experience && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Expérience:</span>
                  <span className="text-gray-900 dark:text-white">{experience}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Localisation:</span>
                  <span className="text-gray-900 dark:text-white">{location}</span>
                </div>
              )}
            </div>
          )}

          {/* Compétences */}
          {skills.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">
                Compétences:
              </h4>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Liens sociaux */}
          {socialLinks.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2">
                Contact:
              </h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                    className="h-8 w-8 p-0"
                    title={link.label || link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="sm"
                  onClick={action.onClick}
                  className="w-full sm:w-auto"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveTeamCard;
