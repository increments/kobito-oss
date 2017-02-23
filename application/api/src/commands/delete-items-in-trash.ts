module kobito.commands {
  export function deleteItemsInTrash() {
    return Item.select(item => item.teamId === '#trash')
    .then(itemsInTrash => {
      return Promise.all(
        itemsInTrash.map(item => Item.remove(item._id))
      );
    });
  }
}
