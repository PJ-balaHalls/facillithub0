"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

import { StepIdentity } from "./step-identity";
import { StepRepo } from "./step-repo";
import { StepPreview } from "./step-preview";

export interface CreateTemplateData {
  name: string;
  description: string;
  category: string;
  repoUrl: string;
  branch: string;
}

const initialData: CreateTemplateData = {
  name: "",
  description: "",
  category: "",
  repoUrl: "",
  branch: "main",
};

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTemplateModal({ isOpen, onClose }: CreateModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateTemplateData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const updateData = (fields: Partial<CreateTemplateData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Aqui entraria a chamada real da Action:
      // await createTemplate(formData);
      console.log("Salvando novo template:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // mock
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepIdentity data={formData} updateData={updateData} />;
      case 2: return <StepRepo data={formData} updateData={updateData} />;
      case 3: return <StepPreview data={formData} />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col p-0 gap-0">
        
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Template Base</DialogTitle>
            <DialogDescription>
              Passo {currentStep} de {totalSteps} - Registre um novo repositório matriz.
            </DialogDescription>
          </DialogHeader>
          
          <div className="w-full bg-muted h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 min-h-[300px]">
          {renderStep()}
        </div>

        <div className="p-4 border-t bg-muted/20 flex justify-between items-center rounded-b-lg">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || isSubmitting}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Salvando..." : "Salvar Template"}
            </Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}