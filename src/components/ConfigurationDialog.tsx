
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GetConfig200, PostPromtsAnalyze200 } from "@/api/core";

interface ConfigurationDialogProps {
  open: boolean;

  settings: PostPromtsAnalyze200;
  config: GetConfig200;

  onOpenChange: (open: boolean) => void;
  onSubmit: (settings: PostPromtsAnalyze200) => void;
}

export function ConfigurationDialog({
  open,
  
  settings,
  config,

  onOpenChange,
  onSubmit,
}: ConfigurationDialogProps) {
  const [model, setModel] = React.useState(settings.service);
  const [appType, setAppType] = React.useState(settings.template);
  const [appName, setAppName] = React.useState(settings.name);
  const [appDescription, setAppDescription] = React.useState(settings.description);

  const handleSubmit = React.useCallback(() => {
    onSubmit({
      name: appName,
      description: appDescription,

      template: appType,
      service: model,
    });

    onOpenChange(false);
  }, [appDescription, appName, appType, model, onOpenChange, onSubmit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Выберите конфигурацию</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            ИИ определил следующие характеристики на основе вашего запрос. Если вы хотите что-то другое, то выберите ниже.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Название приложения
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full p-2 rounded-md bg-background border border-input"
              placeholder="Введите название приложения"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Описание приложения
            </label>
            <textarea
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-background border border-input min-h-[80px] resize-none"
              placeholder="Введите описание приложения"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Модель ИИ
            </label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите модель" />
              </SelectTrigger>
              <SelectContent>
                {config.services.map((currentService) => (
                  <SelectItem value={currentService.id}>{currentService.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Тип приложения
            </label>
            <Select value={appType} onValueChange={setAppType}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {config.templates.map((currentTemplate) => (
                  <SelectItem value={currentTemplate.id}>{currentTemplate.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={!appName.trim() || !appDescription.trim()}
            className="bg-[#4FD1C5] hover:bg-[#45b8ae] text-black"
          >
            Создать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
