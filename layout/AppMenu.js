import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {

    const model = [
        {
            label: 'Componentes',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
                { label: 'Productos', icon: 'pi pi-fw pi-sitemap', to: '/productos' },
                { label: 'Bodegas', icon: 'pi pi-fw pi-building', to: '/bodegas' },
                { label: 'Inventario Bodegas', icon: 'pi pi-fw pi-box', to: '/inventario-bodega' },
                { label: 'Movimientos Inventario', icon: 'pi pi-fw pi-file-pdf', to: '/movimientos' },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
