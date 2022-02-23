import { Timeline } from "./components/Timeline";
import { DataProvider } from "./hooks/data/useData";
import './styles/index.scss';

export default function App() {
  return (
    <div>
      <DataProvider>
        <Timeline />
      </DataProvider>
    </div>
  );
}
