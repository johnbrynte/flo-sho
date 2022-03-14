import { Header } from "./components/Header";
import { UserProvider } from "./util/UserContext";
import { Editor } from "./components/Editor";
import './styles/index.scss';
import { BoardProvider } from "./hooks/useBoard";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <UserProvider>
        <BoardProvider>
          <Header />
          <Editor />
        </BoardProvider>
      </UserProvider>
    </div>
  );
}
