
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="/lovable-uploads/19d4fdac-9077-4b24-8006-3bb2b0251a3f.png" 
              alt="Consultation médicale" 
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Une maternité sereine,<br />
              un avenir en santé
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              De la première échographie aux soins de toute la famille, nous vous accompagnons avec douceur et expertise à chaque étape de la vie. Parce que votre bien-être et celui de vos petits méritent toute notre attention.
            </p>
            
            <Button 
              className="bg-gradient-clinic hover:opacity-90 text-white px-8 py-3 rounded-full"
            >
              Voir le contenu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
