
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <span className="px-3 py-1 text-sm rounded-full bg-primary/5 text-primary inline-block">
            Конструктор веб-сайтов
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Творите свои самые безумные идеи
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Создайте свой следующий веб-сайт без особых усилий, используя естественный язык. 
          Кодирование не требуется - просто опишите, что вы хотите.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/chat")}
            className="group h-12 px-8 hover:bg-primary/90 transition-all"
          >
            Начать творить
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
