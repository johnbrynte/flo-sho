import { Header } from "./components/Header";
import { UserProvider } from "./util/UserContext";
import { Editor } from "./components/Editor";
import './styles/index.scss';

export default function App() {
  return (
    <div>
      <UserProvider>
        <Header />
        <Editor />
      </UserProvider>
    </div>
  );
}
