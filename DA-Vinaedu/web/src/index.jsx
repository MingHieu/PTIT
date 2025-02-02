/* @refresh reload */
import { MetaProvider, Title } from '@solidjs/meta';
import { render } from 'solid-js/web';
import { Toaster } from 'solid-toast';
import './index.css';
import Routes from './routes';
import { DialogProvider } from './shared/components';

const App = () => {
  return (
    <MetaProvider>
      <DialogProvider>
        <Title>VinaEdu - Nền tảng học trực tuyến</Title>
        <Routes />
        <Toaster />
      </DialogProvider>
    </MetaProvider>
  );
};

render(() => <App />, document.getElementById('root'));
