/**
 * Created with JetBrains PhpStorm.
 * User: User
 * Date: 20/03/13
 * Time: 20:30
 * To change this template use File | Settings | File Templates.
 */

/**
 * isset
 * Return true is _var is set
 * @param _var
 * @return {Boolean}
 */
function isset(_var){
    return (typeof _var !== "undefined");
}

/**
 * valueOrDefault
 * Return default if value is set
 * @param _value
 * @param _default
 * @return {*}
 */
function valueOrDefault(_value, _default){
    return !isset(_value) ? _default : _value;
}

function is_int(input){
    return !isNaN(input)&&parseInt(input)==input;
}
