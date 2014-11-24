<?php

/**
 * Implements base_settings_form()
 */
function fxp_trainer_pane_settings_form($checkout_pane) {
  $checkout_message = variable_get('fxp_trainer_pane_field', 'Your order number is [commerce-order:order-number]. You can view your order on your account page when logged in.');
  $form['fxp_trainer_pane_field'] = array(
    '#type' => 'text_format',
    '#title' => t('FXP Checkout Message Pane Field'),
    '#default_value' => $checkout_message['value'],
    '#format' => NULL,
  );
  return $form;
}


/**
   * Implements hook_checkout_form()
   */
  function fxp_trainer_pane_checkout_form($form, $form_state, $checkout_pane, $order) {
    

    $order_wrapper = entity_metadata_wrapper('commerce_order', $order);

    $checkout_message = variable_get('fxp_trainer_pane_field', 'Your order number is [commerce-order:order-number]. You can view your order on your account page when logged in.');
    $checkout_message = str_replace('[commerce-order:order-number]', $order_wrapper->order_id->value(), $checkout_message);

    if($_SESSION['fxp']['bulk_purchase_trainer']){
      foreach($order_wrapper->commerce_line_items as $line_item){
        if($line_item->type->value() == 'fxp_group_discount'){
          drupal_goto('fxp-trainer/bulk-purchase-finalize');
        }else{
          $checkout_form['fxp_trainer_pane_field_display'] = array(
            '#markup' => $checkout_message['value'],
          );          
        }
      }


    }else{
      $checkout_form['fxp_trainer_pane_field_display'] = array(
        '#markup' => $checkout_message['value'],
      );
    }  

    





    return $checkout_form;
  }