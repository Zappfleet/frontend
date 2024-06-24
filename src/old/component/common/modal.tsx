import React, { useState, useEffect } from 'react';

const MyModal = ({ show, title, body, saveButtonTitle, onSave, onHide, size = "sm", saveBtnClassname = "" }: any) => {
  return (
    <div className="modal show modal-div" id="myModal" aria-modal="true" role="dialog" style={{ display: 'block', paddingLeft: '0px', backgroundColor: 'rgb(0,0,0,0.8)' }}>   <div className={`modal-dialog modal-${size}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onHide}></button>
        </div>
        <div className="modal-body">
          {body}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onHide}>بستن</button>
          {saveButtonTitle && (
            <button type="button" className={`btn btn-primary ${saveBtnClassname}`} onClick={onSave}>
              {saveButtonTitle}
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default MyModal;
