import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        api.post('/password/forgot', {
          email: data.email,
        });
        addToast({
          type: 'success',
          title: 'Recuperação de Senha',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });
        // history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro na recuperação de senha',
            description:
              'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};
export default ForgotPassword;
