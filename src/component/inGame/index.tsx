import * as React from "react";
import { observer } from "mobx-react";
import InGameBG from "./inGameBG";
import {
    Contra
} from "../sub";
import {
    SuperContraStore
} from "../../store";
import "./index.scss";

interface InGameProps {
    superContraStore: SuperContraStore;
}

@observer
class InGame extends React.Component<InGameProps, {}> {
    render() {
        const { superContraStore } = this.props;

        return (
            <InGameBG
                    superContraStore={superContraStore}>
                    <Contra />
            </InGameBG>
        );
    }
}

export default InGame;