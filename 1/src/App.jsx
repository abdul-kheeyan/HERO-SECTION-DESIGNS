import nature01 from './assets/nature-01.jpg'
import nature02 from './assets/nature-02.jpg'
import nature03 from './assets/nature-03.jpg'
import nature04 from './assets/nature-04.jpg'
import nature05 from './assets/nature-05.jpg'
import nature06 from './assets/nature-06.jpg'
import nature07 from './assets/nature-07.jpg'
import nature08 from './assets/nature-08.jpg'
import nature09 from './assets/nature-09.jpg'
import WorksWheel from './WorksWheel'

const natureStories = [
  { title: 'Forest Canopy', image: nature01 },
  { title: 'Quiet Waters', image: nature02 },
  { title: 'Mountain Air', image: nature03 },
  { title: 'Into the Woods', image: nature04 },
  { title: 'First Light', image: nature05 },
  { title: 'Open Country', image: nature06 },
  { title: 'Green Haven', image: nature07 },
  { title: 'Wild Horizons', image: nature08 },
  { title: 'Life in the Wild', image: nature09 },
]

function App() {
  return <WorksWheel items={natureStories} label="Into the wild" />
}

export default App
