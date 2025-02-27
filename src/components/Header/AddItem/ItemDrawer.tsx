import React, {FC} from 'react';
import {Button, Drawer} from "antd";
import AddItem from "./AddItem";
import CreateOption from "../../CreateOption/CreateOption";
import {IDrawerOptions} from "../MyHeader";

interface ItemDrawerProps {
    drawer_options: IDrawerOptions;
    setDrawer_options: React.Dispatch<React.SetStateAction<IDrawerOptions>>;
}

const ItemDrawer:FC<ItemDrawerProps> = ({drawer_options, setDrawer_options}) => {

    return (
        <Drawer
            title="Add Item"
            width={520}
            closable={false}
            onClose={() => setDrawer_options((prev) => ({...prev, item_drawer: false}))}
            open={drawer_options.item_drawer}
        >
            <Button style={{marginBottom: 14}} type="primary" onClick={() => setDrawer_options((prev) => ({...prev, item_child: true}))}>
                Create new item
            </Button>

            <AddItem/>

            <Drawer
                title="Create new item window"
                width={520}
                closable={false}
                onClose={() => setDrawer_options((prev) => ({...prev, item_child: false}))}
                open={drawer_options.item_child}
            >
                <CreateOption setDrawer_options={setDrawer_options} />
            </Drawer>
        </Drawer>
    );
};

export default ItemDrawer;