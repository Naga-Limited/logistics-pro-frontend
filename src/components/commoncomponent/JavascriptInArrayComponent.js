export default function JavascriptInArrayComponent ( element, ArrayData ) {

  var length = ArrayData.length

  for (var i = 0; i < length; i++) {

    if (ArrayData[i] == element) {
      return true
    }

  }

  return false
}
