'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import axios from 'axios';

const Login = () => {
  const unameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLInputElement>(null);

  const [areInputsEmpty, setAreInputsEmpty] = useState(true);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [buttonPositionIndex, setButtonPositionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const positions = [
    'translate-x-[-120%]',
    'translate-y-[-150%]',
    'translate-x-[120%]',
    'translate-y-[150%]'
  ];

  const router = useRouter();

  const showMsg = () => {
    const isEmpty = (unameRef.current?.value === '' || passRef.current?.value === '');
    setAreInputsEmpty(isEmpty);

    if (isEmpty) {
      if (btnRef.current) {
        btnRef.current.disabled = true;
      }
      setMessageColor('rgb(218 49 49)');
      setMessage('Por favor, complete los campos.');
    } else {
      setMessage('Ahora puedes continuar');
      setMessageColor('#92ff92');
      if (btnRef.current) {
        btnRef.current.disabled = false;
      }
    }
  };

  const shiftButton = () => {
    showMsg();
    if (!areInputsEmpty) return;
    setButtonPositionIndex((prevIndex) => (prevIndex + 1) % positions.length);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = unameRef.current?.value;
    const password = passRef.current?.value;

    if (!username || !password) {
      setMessage('Por favor, complete los campos antes de continuar');
      setMessageColor('rgb(218 49 49)');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        'http://localhost:4501/api/admin/login',
        {
          Usuario: username,
          Password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/admin/dash');
      } else {
        setMessage(data.message || 'Credenciales inválidas');
        setMessageColor('rgb(218 49 49)');
      }
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Error al conectar con el servidor.';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      setMessage(errorMessage);
      setMessageColor('rgb(218 49 49)');
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: 'url("https://wallpapercrafter.com/desktop1/562030-library-cartoon-books-candles-ladder-ladders.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  };

  return (
    <div
      className="min-h-screen min-w-[450px] flex items-center justify-center"
      style={backgroundStyle}
    >
      <div className="w-[400px] h-[480px] grid relative">
        <div className="absolute w-[85px] text-5xl grid h-[85px] place-content-center
                     border border-[#2a2a2a] z-10 justify-self-center rounded-full bg-[#0e0e0e]">
          <i className="fa fa-user text-[#a2a2a2]"></i>
        </div>

        <form
          className="flex flex-col p-6 pb-2.5 h-[440px] rounded-[30px] bg-black/70 border border-white/10
                     absolute w-full bottom-0 items-center"
          onSubmit={handleLogin}
        >
          <div className="relative my-10 text-xl font-bold text-white">
            Iniciar Sesión
          </div>

          <div className="absolute top-[25%]" style={{ color: messageColor }}>
            {message}
          </div>

          <div className="flex relative w-full">
            <input
              type="text"
              placeholder="Nombre de Usuario"
              id="uname"
              ref={unameRef}
              onInput={showMsg}
              className="block outline-none w-full border-none text-base text-[#d2d2d2]
                         my-6 mb-1.5 caret-[#cccccc] bg-transparent pb-1 pr-6 border-b border-b-[#404040]"
            />
            <i className="fa fa-user absolute text-sm right-2.5 bottom-2.5 text-[#a2a2a2]"></i>
          </div>

          <div className="flex relative w-full">
            <input
              type="password"
              placeholder="Contraseña"
              id="pass"
              ref={passRef}
              onInput={showMsg}
              className="block outline-none w-full border-none text-base text-[#d2d2d2]
                         my-6 mb-1.5 caret-[#cccccc] bg-transparent pb-1 pr-6 border-b border-b-[#404040]"
            />
            <i className="fa fa-lock absolute text-sm right-2.5 bottom-2.5 text-[#a2a2a2]"></i>
          </div>

          <div
            className="p-5 transition-all duration-200 ease-linear"
            onMouseEnter={shiftButton}
            onTouchStart={shiftButton}
            ref={btnContainerRef}
          >
            {isLoading ? (
              <div className="my-6 flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10 border-t-[#ffffff] animate-spin"></div>
              </div>
            ) : (
              <input
                type="submit"
                id="login-btn"
                value="Login"
                className={`p-1.5 px-5 border-none bg-[#193e61] text-white font-semibold text-base
                            rounded-[15px] transition-all duration-300 my-6
                            ${areInputsEmpty ? positions[buttonPositionIndex] : 'translate-x-0 translate-y-0'}`}
                ref={btnRef}
                onMouseEnter={shiftButton}
                onTouchStart={shiftButton}
                disabled={areInputsEmpty}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;