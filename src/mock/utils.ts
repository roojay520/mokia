import dayjs from 'dayjs'

import { MAX_DATE, MIN_DATE } from './constants'
import { integer } from './generators'

export type Func<R = any> = (...args: any[]) => R

/**
 * Checks if `target` is a Class
 *
 * @example
 *
 * isClass(class Foo { })
 * // => true
 *
 * isClass(function foo () { })
 * // => false
 *
 * isClass({})
 * // => false
 */
export function isClass (target: any): target is new (...args: any[]) => any {
  return typeof target === 'function'
    && /^class\s/.test(Function.prototype.toString.call(target))
}

/**
 * Checks if `func` is a Function
 *
 * @example
 *
 * isFunction(function foo () { })
 * // => true
 *
 * isFunction(class Foo { })
 * // => false
 *
 * isFunction('')
 * // => false
 */
export function isFunction (func: any): func is Func {
  return typeof func === 'function' && !isClass(func)
}

/**
 * Returns value that determined by original value
 *
 * @example
 *
 * defaultTo(1, 2)
 * // => 1
 *
 * defaultTo(undefined, 10)
 * // => 10
 *
 * defaultTo(NaN, 10)
 * // => 10
 *
 * defaultTo(null, 10)
 * // => 10
 */
export function defaultTo<T> (value: any, defaultValue: T): T {
  return (value === undefined || value === null || isNaN(value))
    ? defaultValue : value
}

/**
 * Returns value that determined by original value
 *
 * @example
 *
 * defaultBy(1, 2, 3)
 * // => 2
 *
 * defaultBy(undefined, 10, 20)
 * // => 20
 *
 * defaultBy(NaN, 10, 20)
 * // => 20
 *
 * defaultBy(null, 10, 20)
 * // => 20
 */
export function defaultBy<T> (value: any, trueValue: any, falseValue: any) {
  return (value === undefined || value === null || isNaN(value))
    ? falseValue : trueValue
}

/**
 * Returns an integer from any type
 *
 * @example
 *
 * ensureInteger(12)
 * // => 12
 *
 * ensureInteger(2.5)
 * // => 2
 *
 * ensureInteger(null)
 * // => 0
 *
 * ensureInteger(null, 1)
 * // => 1
 */
export function ensureInteger (value: any, defaultValue: number = 0): number {
  const num = parseInt(value, 10)
  return isNaN(num) ? defaultValue : num
}

/**
 * Returns a natural number from any type
 *
 * @example
 *
 * ensureNatural(12)
 * // => 12
 *
 * ensureNatural(2.5)
 * // => 2
 *
 * ensureNatural(-1)
 * // => 0
 *
 * ensureInteger(null)
 * // => 0
 */
export function ensureNatural (value: any, defaultValue: number = 0): number {
  const num = ensureInteger(value, defaultValue)
  return num < 0 ? 0 : num
}

/**
 * Returns a string with capital first letter
 *
 * @example
 *
 * capitalize('abc')
 * // => 'Abc'
 */
export function capitalize (value: string) {
  return value.substring(0, 1).toUpperCase() + value.substring(1)
}

export type DateType = number | string | Date

/**
 * Transform DateLike variable to string with format string
 *
 * @example
 *
 * formatDate('2018-12-06 12:00:00', 'YYYY/MM/DD HH:mm')
 * // => 2018/12/06 12:00
 *
 * formatDate(1544068800000, 'YYYY/MM/DD HH:mm')
 * // => 2018/12/06 12:00
 *
 * formatDate(new Date(), 'YYYY/MM/DD HH:mm')
 * // => 2018/12/06 12:00
 */
export function formatDate (date: DateType, formatStr: string) {
  return dayjs(date).format(formatStr)
}

/**
 * Return random Date object
 *
 * @example
 *
 * randomDate()
 * // => [Thu Dec 06 2018 12:00:00]
 *
 * randomDate('2018-12-06 00:00:00')
 * // => [Tue Jul 26 2016 17:32:58]
 *
 * randomDate('2018-12-05 00:00:00', '2018-12-06 00:00:00')
 * // => [Wed Dec 05 2018 13:27:48]
 */
export function randomDate (): Date
export function randomDate (max: DateType): Date
export function randomDate (min: DateType, max: DateType): Date
export function randomDate (min?: DateType, max?: DateType): Date {
  const minDate = max && min ? new Date(min) : MIN_DATE
  const maxDate = max ? new Date(max) : min ? new Date(min) : MAX_DATE

  return new Date(integer(minDate.getTime(), maxDate.getTime()))
}

/**
 * Return image url
 *
 * @candidates
 *
 * http://dummyimage.com
 * http://dn-placeholder.qbox.me
 * https://placeholder.com
 * http://fpoimg.com
 * http://placekitten.com
 * http://placeimg.com
 * http://uifaces.com
 */
export function createUrlImage (
  size: string = '100x100',
  text: string = '',
  background: string = '000',
  foreground: string = 'fff',
  format: 'png' | 'jpg' | 'gif' = 'png'
): string {
  const host = 'http://dummyimage.com'
  return `${host}/${size}/${background}/${foreground}/${format}?text=${text}`
}

/**
 * Return Base64 image
 *
 * @candidates
 *
 * https://github.com/Automattic/node-canvas
 */
export function createBase64Image (
  size: string = '100x100',
  text: string = '',
  background: string = '000',
  foreground: string = 'fff',
  format: 'png' | 'jpg' | 'gif' = 'png'
): string {
  // todo:
  return ''
}

/**
 * Checks if `obj` is a true object
 *
 * @example
 *
 * isTrueObject({foo: 'bar'})
 * // => true
 *
 * isTrueObject(new Object())
 * // => true
 *
 * isTrueObject(null)
 * // => false
 *
 * isTrueObject(function foo () { })
 * // => false
 */
export function isTrueObject (obj: any): obj is Object {
  return !!obj && typeof obj === 'object'
}

/**
 * Returns an object with properties picked from another
 *
 * @example
 *
 * pickProps({ name: 'Harrie', age: 18, gender: 'male' }, 'name age')
 * // => { name: 'Harrie', age: 18 }
 *
 * pickProps({ name: 'Harrie', age: 18, gender: 'male' }, ['name', 'age'])
 * // => { name: 'Harrie', age: 18 }
 */
export function pickProps<T extends Object> (source: T, props: string | string[]): Partial<T> {
  if (!isTrueObject(source)) return { }
  if (!props.length) return source

  props = Array.isArray(props) ? props : props.split(' ')

  return props.reduce((r, prop) => {
    r[prop] = (source as any)[prop]

    return r
  }, {} as any)
}

/**
 * Returns an array with items picked from another
 *
 * @example
 *
 * pickProps(['a', 'b', 'c', 'd'], 3)
 * // => ['d', 'a', 'c']
 */
export function pickItems<T> (list: T[], length: number): T[] {
  length = length < list.length ? length : list.length

  return list
    .sort(() => Math.random() - 0.5)
    .slice(0, length)
}

/**
 * Returns a debounced function
 *
 * @example
 *
 * debounce(function () { }, 200)
 */
export function debounce<T extends Function> (fn: T, delay: number): T {
  let timer: any

  return function (this: any, ...args: any[]) {
    clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  } as any
}
