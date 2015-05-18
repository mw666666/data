function Model(model){
    this.model = model;

    this.data = {};
    this.data.where = null;
    this.data.limit = 0;
    this.data.offset = 0;
    this.data.fields = null;
    this.data.order = '';
    this.data.raw = false;

    this.result = null;
    this.action = null;    
}

Model.prototype = {
    constructor: Model,
    
}

_.extend(Model.prototype, {
    where: function(param) {
        this.data.where = param;
        return this;
    },
    limit: function(limit) {
        this.data.limit = limit;
        return this;
    },
    offset: function(offset) {
        this.data.offset = offset;
        return this;
    },
    //返回哪些字段
    fields: function(fields) {
        this.data.fields = fields;
        return this;
    },
    order: function(order) {
        if (this.Model.db_type == 'sql') {
            var order_str = '';
            for (var i in order) {
                order_str += i + ' ' + order[i] + ' '
            }
            this.data.order = order_str;
        } else {
            this.data.order = order
        }
        return this;
    },
    raw: function(raw) {
        this.data.raw = raw;
        return this;
    }
});

Model.create = function(){
    var model = new Model();
    return model;
}

module.exports = Model;