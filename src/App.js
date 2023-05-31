import logo from './logo.svg';
import './App.css';
import Search from './pages/search'

function App() {
  return (
    <div style={styles.container}>
      <Search />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
}

export default App;
