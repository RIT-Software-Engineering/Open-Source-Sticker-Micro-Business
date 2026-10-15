import type { ReactElement } from "react";
import type { INavigableProps } from "../modules/Navigator";
import Button from "../components/control/Button";

export default function NotFound({nav}: INavigableProps): ReactElement {
    return <div>
        {`Could not find page ${nav.Name}`}
        <Button color="#00000000" onClick={() => nav.Back()}>Go Back</Button>
    </div>
}