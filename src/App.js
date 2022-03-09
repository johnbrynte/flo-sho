import { Header } from "./components/Header";
import { Timeline } from "./components/Timeline";
import { DataProvider } from "./hooks/data/useData";
import { UserProvider } from "./util/UserContext";
import './styles/index.scss';

export default function App() {
  return (
    <div>
      <UserProvider>
        <DataProvider>
          <Header />
          <Timeline />
        </DataProvider>
      </UserProvider>
    </div>
  );
}
