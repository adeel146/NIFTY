<PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                      <div>
                        <div
                          {...bindTrigger(popupState)}
                          className="w-full cursor-pointer rounded-md bg-white"
                        >
                          <MenuItem onClick={() => setIsOpenUsers(true)}>
                            <ListItemIcon>
                              <ContentCut fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Assign to users</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                              <ChevronRightIcon />
                            </Typography>
                          </MenuItem>
                        </div>
                        {isOpenUsers && (
                          <Popover
                            onClose={() => setIsOpenUsers(false)}
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: "200px",
                                height: "200px",
                                overflow: "auto",
                              }}
                            >
                              <div className="mt-2 px-2">
                                <Select
                                  menuIsOpen={true}
                                  className="w-full"
                                  options={membersList}
                                  placeholder="Search..."
                                  onChange={handleAssigntoChange}
                                />
                              </div>
                            </Box>
                          </Popover>
                        )}
                      </div>
                    )}
                  </PopupState>