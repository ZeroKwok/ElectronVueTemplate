const IS_ELECTRON = !!window.electron;
const IS_DEV      = window.context
                    ? window.context.env.NODE_ENV === 'development' 
                    : (import.meta.env ? import.meta.env.DEV : false);

export default { IS_ELECTRON, IS_DEV };