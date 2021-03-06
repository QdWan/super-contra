import { observable, useStrict, action } from "mobx";
import {
    GameStatusType,
    LevelType,
    StaticSquareManagementType,
    StaticSquareStatusType,
    BulletManagementType,
    DynamicSquareManagementType,
    ContraInfoType,
    PositionType,
    LifeStatusType
} from "../../common/constant";
import {
    getStaticSquareMap
} from "../../common/util";

useStrict(true);

class SuperContraStore {
    constructor() {
        this.staticSquareMap = getStaticSquareMap(this.level);
        this.autoAddDynamicSquare();
    }

    private canUpdateInGameGBLeft: boolean = true;

    @observable public level: LevelType = 1;
    @action.bound public updateLevel(parm: LevelType): void {
        this.level = parm;
    }

    @observable public gameStatus: GameStatusType = 0;
    @action.bound public updateGameStatus(parm: GameStatusType): void {
        this.gameStatus = parm;
    }

    @observable public inGameGBLeft: number = 0;
    @action.bound public updateInGameGBLeft(): void {
        if ( this.canUpdateInGameGBLeft ) {
            const _self = this;
            this.canUpdateInGameGBLeft = false;
            if ( this.inGameGBLeft === -5120 ) {
                this.updateGameStatus(3);
            } else {
                this.inGameGBLeft -= 512;
                this.autoAddDynamicSquare();
            }
            setTimeout(() => {
                _self.canUpdateInGameGBLeft = true;
            }, 2000);
        }
    }

    @observable public staticSquareMap: StaticSquareManagementType[][];
    @action.bound public updateStaticSquareMap(col: number, row: number, status: StaticSquareStatusType): void {
        const preVal = this.staticSquareMap[col][row].status;
        if ( preVal !==  status) {
            this.staticSquareMap[col][row].status = status;
        }
    }

    @observable public dynamicSquareMap: Array<DynamicSquareManagementType | null> = [];
    @action.bound public  addDynamicSquare (parm: DynamicSquareManagementType) {
        this.dynamicSquareMap.push(parm);
    }
    @action.bound public deleteDynamicSquare (parm: number) {
        this.dynamicSquareMap.splice(parm, 1, null);
    }
    @action.bound public updateDynamicSquare (parm: Partial<DynamicSquareManagementType>, index: number) {
        this.dynamicSquareMap[index] = Object.assign({}, this.dynamicSquareMap[index], parm);
    }
    private autoAddDynamicSquare() {
        if ( this.inGameGBLeft === 0 ) {
            this.createMushRoom({
                left: 640,
                top: 384
            });
        } else if ( this.inGameGBLeft === -512 ) {
            this.createMushRoom({
                left: 736,
                top: 384
            });
        } else if ( this.inGameGBLeft === -1024 ) {
            this.createMushRoom({
                left: 1056,
                top: 384
            });
            this.createMushRoom({
                left: 1216,
                top: 384
            });
        }
        else if ( this.inGameGBLeft === -1536 ) {
            this.createMushRoom({
                left: 1984,
                top: 136
            });
            this.createMushRoom({
                left: 2016,
                top: 136
            });
        }
        else if ( this.inGameGBLeft === -2048 ) {
            this.createMushRoom({
                left: 2144,
                top: 384
            });
        }
    }
    private createMushRoom(position: PositionType) {
        this.addDynamicSquare({
            type: 0,
            status: 0,
            toward: 0,
            position
        });
    }

    @observable public bulletMap: Array<BulletManagementType | null> = Array(10).fill(null);
    @action.bound public addBullet (parm: BulletManagementType) {
        for (let i = 0; i < this.bulletMap.length; i ++) {
            if (!this.bulletMap[i]) {
                this.bulletMap[i] = parm;
                return;
            }
        }
    }
    @action.bound public deleteBullet (parm: number) {
        this.bulletMap[parm] = null;
    }

    @observable public contraInfo: ContraInfoType = {
        position: {
            left: 0,
            top: 0
        },
        lifeStatus: 0
    };
    @action.bound public updateContraPosition(parm: Partial<PositionType>) {
        this.contraInfo.position = { ...this.contraInfo.position, ...parm };
    }
    @action.bound public updateContraLifeStatus(parm: LifeStatusType) {
        this.contraInfo.lifeStatus = parm;
    }
}

export default SuperContraStore;