if (window.require) {
    window.nodeRequire = window.require;
    delete window.require;
    nodeRequire('electron').webFrame.registerURLSchemeAsPrivileged('file');
}