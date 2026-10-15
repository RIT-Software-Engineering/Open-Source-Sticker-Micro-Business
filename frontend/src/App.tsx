import { type ReactElement } from 'react'
import './App.css'
import { useColors } from './modules/context/Colors'
import Screen from './Screen';

export default function App(): ReactElement {
    const colors = useColors();

    return <div style={{display: "flex", flex: 1, backgroundColor: colors.back, color: colors.text}}>
        <Screen/>
    </div>
}