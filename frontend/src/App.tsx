import { type ReactElement } from 'react'
import './App.css'
import Screen from './Screen';
import { useColors } from './modules/Colors';

export default function App(): ReactElement {
    const colors = useColors();

    return <div style={{display: "flex", flex: 1, backgroundColor: colors.light, color: colors.dark, fontFamily: "Inter"}}>
        <Screen/>
    </div>
}