const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO check if they are logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item(
      { where },
      `{ id, title }`
    );
    // TODO check if the user has the permissions
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    const { name } = args;
    const email = args.email.toLowerCase();
    const password = await bcrypt.hashSync(
      args.password,
      10
    );
    const userInfo = {
      name,
      email,
      password,
      permissions: { set: ['USER'] }
    };
    const user = await ctx.db.mutation.createUser(
      {
        data: userInfo
      },
      info
    );
    const token = jwt.sign(
      { userId: user.id },
      process.env.APP_SECRET
    );
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });
    return user;
  }
};

module.exports = Mutations;
