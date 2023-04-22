package vector

import (
	"reflect"
)

// 小写 只能通过工厂函数创建
type Vector struct {
	values []interface{}
}

// 创建工厂函数
func New(cap int) *Vector {
	this := new(Vector)
	this.values = make([]interface{}, 0, cap)

	return this
}

func (this *Vector) IsEmpty() bool {
	return len(this.values) == 0
}

// 元素数量
func (this *Vector) Size() int {
	return len(this.values)
}

// 追加单个元素
func (this *Vector) Append(value interface{}) bool {
	this.values = append(this.values, value)
	return true
}

// 追加元素切片
func (this *Vector) AppendAll(values []interface{}) bool {
	if values == nil || len(values) < 1 {
		return false
	}
	this.values = append(this.values, values...)
	return true
}

// 插入单个元素
func (this *Vector) Insert(index int, value interface{}) bool {
	if index < 0 || index >= len(this.values) {
		return false
	}
	this.values = append(this.values[:index], append([]interface{}{value}, this.values[index:]...)...)
	return true
}

// 插入元素切片
func (this *Vector) InsertAll(index int, values []interface{}) bool {
	if index < 0 || index >= len(this.values) || values == nil || len(values) < 1 {
		return false
	}
	this.values = append(this.values[:index], append(values, this.values[index:]...)...)
	return true
}

// 移除
func (this *Vector) Remove(index int) bool {
	if index < 0 || index >= len(this.values) {
		return false
	}
	// 重置为 nil 防止内存泄漏
	this.values[index] = nil
	this.values = append(this.values[:index], this.values[index+1:]...)
	return true
}

// 范围移除 从 fromIndex(包含) 到 toIndex(不包含) 之间的元素
func (this *Vector) RemoveRange(fromIndex, toIndex int) bool {
	if fromIndex < 0 || fromIndex >= len(this.values) || toIndex > len(this.values) || fromIndex > toIndex {
		return false
	}
	// 重置为 nil 防止内存泄漏
	for i := fromIndex; i < toIndex; i++ {
		this.values[i] = nil
	}
	this.values = append(this.values[:fromIndex], this.values[toIndex:]...)
	return true
}

// 全部移除
func (this *Vector) RemoveAll() {
	// 重置为 nil 防止内存泄漏
	for i := 0; i < this.Size(); i++ {
		this.values[i] = nil
	}
	this.values = this.values[0:0]
}

func (this *Vector) getIndex(value interface{}) int {
	for i := 0; i < len(this.values); i++ {
		if reflect.DeepEqual(this.values[i], value) {
			return i
		}
	}
	return -1
}

// 是否存在该元素值
func (this *Vector) Contains(value interface{}) bool {
	return this.getIndex(value) >= 0
}

// 获取元素值第一次出现的索引
func (this *Vector) IndexOf(value interface{}) int {
	return this.getIndex(value)
}

// 获取元素值最后一次出现的索引
func (this *Vector) LastIndexOf(value interface{}) int {
	for i := len(this.values) - 1; i >= 0; i-- {
		if reflect.DeepEqual(this.values[i], value) {
			return i
		}
	}
	return -1
}

// 得到索引对应的元素值
func (this *Vector) GetValue(index int) interface{} {
	if index < 0 || index >= len(this.values) {
		return nil
	}
	return this.values[index]
}

// 设置值
func (this *Vector) SetValue(index int, value interface{}) bool {
	if index < 0 || index >= len(this.values) {
		return false
	}
	this.values[index] = value
	return true
}

func (this *Vector) ToArray() []interface{} {
	dst := make([]interface{}, this.Size())
	copy(dst, this.values)
	return dst
}
