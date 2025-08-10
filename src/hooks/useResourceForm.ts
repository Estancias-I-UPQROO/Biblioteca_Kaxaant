import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type ResourceFormData = {
  title: string;
  description: string;
  image: string;
  siteLink: string;
};

const resourceSchema = yup.object().shape({
  title: yup.string()
    .required('El título es obligatorio')
    .min(3, 'Mínimo 3 caracteres'),
  description: yup.string()
    .required('La descripción es obligatoria')
    .min(10, 'Mínimo 10 caracteres'),
  image: yup.string()
    .required('La imagen es obligatoria'),
  siteLink: yup.string()
    .required('El enlace es obligatorio')
    .url('Debe ser una URL válida')
});

export const useResourceForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    trigger
  } = useForm<ResourceFormData>({
    resolver: yupResolver(resourceSchema),
    mode: 'onChange'
  });

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    reset,
    setValue,
    watch,
    trigger
  };
};