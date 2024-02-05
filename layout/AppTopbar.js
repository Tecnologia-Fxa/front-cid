import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';

// eslint-disable-next-line react/display-name
const AppTopbar = forwardRef((_props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/dashboard" className="layout-topbar-logo">
                <img src={`/util/fxa-cid-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.png`} width="40px" height={'90px'} widt={'true'} alt="logo" />
                <span className='text-base'>Control Inventario y Despachos</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-unlock"></i>
                        <span>Credenciales</span>
                    </button>
                    <Link href="/login">
                        <button type="button" className="p-link layout-topbar-button">
                            <i className="pi pi-sign-out"></i>
                            <span>Cerrar Sesión</span>
                        </button>
                    </Link>
            </div>
        </div>
    );
}); 

export default AppTopbar;
